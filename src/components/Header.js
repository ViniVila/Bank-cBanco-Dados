import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

// Componente reutilizável para o topo das telas.
// Ele recebe o e-mail do estudante e exibe uma saudação.
export default function Header({ email }) {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>SENAI Bank</Text>
      <Text style={styles.greeting}>Olá, {email || "estudante@senai.br"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    paddingTop: 36,
    borderBottomLeftRadius: theme.radius.lg,
    borderBottomRightRadius: theme.radius.lg,
  },
  appName: { color: theme.colors.white, fontSize: 28, fontWeight: "bold" },
  greeting: { color: theme.colors.white, marginTop: 6, fontSize: 16 },
});
