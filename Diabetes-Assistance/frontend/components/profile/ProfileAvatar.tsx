
import { View, Image, StyleSheet } from "react-native";

export default function ProfileAvatar() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/profileIcon.png")} 
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatar: {
    width: 230,
    height: 230,
    borderRadius: 50,
  },
});
