import { View, Text, StyleSheet } from "react-native";

export default function ProfileHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
});
