import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function moeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function DashboardScreen({
  navigation,
  saldo,
  entradas,
  saidas,
  totalMovimentacoes,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>SENAI Bank</Text>
      <Text style={styles.subtitulo}>Resumo financeiro</Text>

      <View style={styles.cardSaldo}>
        <Text style={styles.rotuloSaldo}>Saldo atual</Text>
        <Text style={styles.saldo}>{moeda(saldo)}</Text>
      </View>

      <View style={styles.linha}>
        <View style={styles.card}>
          <Text style={styles.rotulo}>Receitas</Text>
          <Text style={styles.valor}>{moeda(entradas)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.rotulo}>Despesas</Text>
          <Text style={styles.valor}>{moeda(saidas)}</Text>
        </View>
      </View>

      <View style={styles.cardContador}>
        <Text style={styles.rotulo}>Movimentações realizadas</Text>
        <Text style={styles.contador}>{totalMovimentacoes}</Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Movimentacao")}
      >
        <Text style={styles.textoBotao}>
          + Nova movimentação
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => navigation.navigate("Extrato")}
      >
        <Text style={styles.textoBotaoSecundario}>
          Ver extrato
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoBanco}
        onPress={() => navigation.navigate("AdminLogin")}
      >
        <Text style={styles.textoBotaoBanco}>
          Visualizar Banco SQLite
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.replace("Login")}>
        <Text style={styles.textoVoltar}>← Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F4F6F8",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#003B71",
  },
  subtitulo: {
    color: "#5D6770",
    marginTop: 4,
    marginBottom: 24,
  },
  cardSaldo: {
    backgroundColor: "#003B71",
    padding: 22,
    borderRadius: 18,
  },
  rotuloSaldo: {
    color: "#DDEAF3",
  },
  saldo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 6,
  },
  linha: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },
  cardContador: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  rotulo: {
    color: "#5D6770",
  },
  valor: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
  },
  contador: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: "bold",
    color: "#003B71",
  },
  botao: {
    backgroundColor: "#D71920",
    padding: 16,
    borderRadius: 12,
    marginTop: 28,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  botaoSecundario: {
    borderWidth: 2,
    borderColor: "#003B71",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  textoBotaoSecundario: {
    color: "#003B71",
    fontWeight: "bold",
    textAlign: "center",
  },
  botaoBanco: {
    backgroundColor: "#E7EEF5",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  botaoVoltar:{padding:12,marginTop:5},
  textoVoltar:{textAlign:"center",color:"#003B71",fontWeight:"bold"},
  textoBotaoBanco: {
    color: "#003B71",
    fontWeight: "bold",
    textAlign: "center",
  },
});
