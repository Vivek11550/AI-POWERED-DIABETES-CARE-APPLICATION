import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../src/services/api";
import * as ImagePicker from "expo-image-picker";

type Message = {
  _id: string;
  senderRole: "doctor" | "patient";
  message: string;
  imageUrl?: string;
  createdAt: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { patientId, chatId: chatIdParam } = useLocalSearchParams<{
    patientId?: string;
    chatId?: string;
  }>();

  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [headerName, setHeaderName] = useState("Consultation");
  const [senderRole, setSenderRole] = useState<"doctor" | "patient">("doctor");
  const [loadingChat, setLoadingChat] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const chatIdRef = useRef("");
  const flatListRef = useRef<FlatList>(null); // Added ref for auto-scroll

  useEffect(() => {
    initChat();
    const interval = setInterval(() => {
      if (chatIdRef.current) {
        loadMessages(chatIdRef.current);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (chatId) await loadMessages(chatId);
    setRefreshing(false);
  }, [chatId]);

  const initChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      if (!token || !role) return;

      setSenderRole(role as "doctor" | "patient");

      if (role === "patient" && chatIdParam) {
        setChatId(chatIdParam);
        chatIdRef.current = chatIdParam;
        const chatRes = await API.get("/chat/patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorId = chatRes.data.doctorId;
        const doctorProfile = await API.get(`/profile/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHeaderName(`Dr. ${doctorProfile.data.fullName}`);
        await loadMessages(chatIdParam);
      } else if (role === "doctor" && patientId) {
        const patientProfile = await API.get(`/profile/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHeaderName(patientProfile.data.fullName);
        const chatRes = await API.post(
          "/chat/start",
          { patientId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChatId(chatRes.data._id);
        chatIdRef.current = chatRes.data._id;
        await loadMessages(chatRes.data._id);
      }
    } catch (error) {
      console.log("Chat init error:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await API.get(`/chat/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.log("Load messages error:", error);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const currentText = text;
      setText("");
      await API.post(
        `/chat/${chatId}/message`,
        { message: currentText, senderRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadMessages(chatId);
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      quality: 0.7,
    });

    if (!result.canceled) {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      // @ts-ignore
      formData.append("image", {
        uri: result.assets[0].uri,
        name: "chat.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("senderRole", senderRole);

      try {
        await API.post(`/chat/${chatId}/message`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        loadMessages(chatId);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image");
      }
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderRole === senderRole;
    const deleteMessage = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        await API.delete(`/chat/message/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadMessages(chatId);
      } catch (error) {
        Alert.alert("Error", "Could not delete message");
      }
    };

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myWrapper : styles.otherWrapper]}>
        <TouchableOpacity
          onLongPress={() =>
            isMe &&
            Alert.alert("Delete", "Delete message?", [
              { text: "Cancel" },
              { text: "Delete", onPress: deleteMessage },
            ])
          }
          style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          {item.message ? (
            <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
              {item.message}
            </Text>
          ) : null}

          {item.imageUrl && (
            <TouchableOpacity
              onPress={() =>
                setSelectedImage(`${process.env.EXPO_PUBLIC_CHAT_IMAGE_URL}${item.imageUrl}`)
              }
            >
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_CHAT_IMAGE_URL}${item.imageUrl}` }}
                style={styles.chatImage}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: headerName,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: '700', color: '#0F172A' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
              <Ionicons name="chevron-back" size={28} color="#0F172A" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Android fix: Change to 'height'
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={["#0EA5E9"]} 
              tintColor="#0EA5E9" 
            />
          }
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={26} color="#64748B" />
          </TouchableOpacity>

          <TextInput
            placeholder="Type your message..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            textAlignVertical="center" // Android improvement
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!text.trim() || !chatId}
            style={[styles.sendBtn, (!text.trim() || !chatId) && styles.disabledSend]}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={!!selectedImage} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.modalBg}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
            <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedImage(null)}>
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  listContent: { padding: 16, paddingBottom: 20 },
  messageWrapper: { marginBottom: 12, width: "100%", flexDirection: "row" },
  myWrapper: { justifyContent: "flex-end" },
  otherWrapper: { justifyContent: "flex-start" },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  myBubble: { backgroundColor: "#0EA5E9", borderBottomRightRadius: 2 },
  otherBubble: { backgroundColor: "#FFFFFF", borderBottomLeftRadius: 2, borderWidth: 1, borderColor: "#F1F5F9" },
  messageText: { fontSize: 15, lineHeight: 20 },
  myText: { color: "#FFFFFF", fontWeight: "500" },
  otherText: { color: "#1E293B" },
  chatImage: { width: 220, height: 220, borderRadius: 12, marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    // Android specific padding fix to avoid box squeezing
    paddingBottom: Platform.OS === "ios" ? 25 : 12, 
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 10,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconBtn: { padding: 4 },
  sendBtn: {
    backgroundColor: "#0EA5E9",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  disabledSend: { backgroundColor: "#94A3B8" },
  modalBg: { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
  fullImage: { width: "100%", height: "80%", resizeMode: "contain" },
  closeModal: { position: "absolute", top: 50, right: 20 },
});