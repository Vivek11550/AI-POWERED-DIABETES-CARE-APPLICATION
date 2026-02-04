import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function EditProfileButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#9CC9A7",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
