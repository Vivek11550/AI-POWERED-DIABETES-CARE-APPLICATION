// components/profile/ProfileAvatar.tsx
import { View, Image, StyleSheet } from "react-native";

export default function ProfileAvatar() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/femaleprofile.png")} 
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 10,
    marginTop:30
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
