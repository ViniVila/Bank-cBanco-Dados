import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

// SummaryCard resume receitas e despesas da conta.
export default function SummaryCard({ entradas, saidas }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Receitas</Text>
        <Text style={[styles.value, { color: theme.colors.success }]}>R$ {entradas.toFixed(2).replace(".", ",")}</Text>
      </View>
      <View>
        <Text style={styles.label}>Despesas</Text>
        <Text style={[styles.value, { color: theme.colors.danger }]}>R$ {saidas.toFixed(2).replace(".", ",")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { color: theme.colors.muted, marginBottom: 6 },
  value: { fontSize: 18, fontWeight: "bold" },
});
