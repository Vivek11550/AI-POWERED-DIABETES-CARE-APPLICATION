import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../src/services/api";

type Message = {
  _id: string;
  senderRole: "doctor" | "patient";
  message: string;
};

export default function ChatScreen() {
  const { patientId, chatId: chatIdParam } =
    useLocalSearchParams<{
      patientId?: string;
      chatId?: string;
    }>();

  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [headerName, setHeaderName] = useState("Consultation");
  const [senderRole, setSenderRole] =
    useState<"doctor" | "patient">("doctor");
  const [loadingChat, setLoadingChat] = useState(true);

  useEffect(() => {
    initChat();
  }, []);

  /* ---------------- INIT CHAT ---------------- */

  const initChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token || !role) return;

      setSenderRole(role as "doctor" | "patient");

      /* ===============================
         PATIENT OPENING CHAT
      =============================== */
      if (role === "patient" && chatIdParam) {
        setChatId(chatIdParam);

        // 1️⃣ get chat to know doctorId
        const chatRes = await API.get("/chat/patient", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const doctorId = chatRes.data.doctorId;

        // 2️⃣ fetch doctor profile
        const doctorProfile = await API.get(
          `/profile/doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHeaderName(
          `Dr. ${doctorProfile.data.fullName} (${doctorProfile.data.specialization})`
        );

        await loadMessages(chatIdParam);
        return;
      }

      /* ===============================
         DOCTOR OPENING CHAT
      =============================== */
      if (role === "doctor" && patientId) {
        // fetch patient profile
        const patientProfile = await API.get(
          `/profile/patient/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHeaderName(patientProfile.data.fullName);

        // create or get chat
        const chatRes = await API.post(
          "/chat/start",
          { patientId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setChatId(chatRes.data._id);
        await loadMessages(chatRes.data._id);
      }
    } catch (error) {
      console.log("Chat init error:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  /* ---------------- LOAD MESSAGES ---------------- */

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

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!chatId) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await API.post(
        `/chat/${chatId}/message`,
        {
          message: text,
          senderRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setText("");
      loadMessages(chatId);
    } catch (error) {
      console.log("Send message error:", error);
    }
  };

  /* ---------------- RENDER MESSAGE ---------------- */

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderRole === senderRole;

    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe && { color: "white" },
          ]}
        >
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Consultation with {headerName}
        </Text>
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          !loadingChat ? (
            <Text style={{ textAlign: "center", color: "gray" }}>
              No messages yet
            </Text>
          ) : null
        }
      />

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!chatId}
          style={[
            styles.sendBtn,
            !chatId && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    
    padding: 35,
    backgroundColor: "#2563eb",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  myBubble: {
    backgroundColor: "#2563eb",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
  },
  inputRow: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    marginBottom:15
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 20,
  },
  sendText: {
    color: "white",
    fontWeight: "bold",
  },
});
