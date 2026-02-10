import { View, Image, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";


const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 2000);
    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/frontimg.png")}
        style={styles.backgroundImage}
        resizeMode="cover" 
      />
      
      {/* Loading indicator overlay */}
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.2)', 
  },
});