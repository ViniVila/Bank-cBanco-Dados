import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

// CardBalance mostra o saldo atual da conta.
// O valor é recebido por props para permitir reutilização.
export default function CardBalance({ saldo }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo disponível</Text>
      <Text style={styles.value}>R$ {saldo.toFixed(2).replace(".", ",")}</Text>
      <Text style={styles.hint}>Conta educacional SENAI Bank</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  label: { color: theme.colors.muted, fontSize: 15 },
  value: { color: theme.colors.dark, fontSize: 36, fontWeight: "bold", marginTop: 8 },
  hint: { color: theme.colors.muted, marginTop: 8 },
});
