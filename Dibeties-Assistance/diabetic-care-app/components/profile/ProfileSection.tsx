import { View, Text, StyleSheet } from "react-native";

export default function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
});
