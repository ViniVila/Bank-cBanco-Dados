import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../styles/theme";

// Botão de ação reutilizável.
// Recebe título, cor opcional e função onPress.
export default function ActionButton({ title, onPress, color = theme.colors.dark }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 15,
    borderRadius: theme.radius.md,
    margin: 5,
    alignItems: "center",
  },
  text: { color: theme.colors.white, fontWeight: "bold" },
});
