import {
  FlatList,
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

function formatarData(dataISO) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dataISO));
}

export default function StatementScreen({ navigation, movements }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Extrato
      </Text>

      <Text style={styles.orientacao}>
        O extrato é somente para consulta.
        Inclusões, alterações e exclusões são praticadas
        pelo Console SQL da tela Banco de Dados.
      </Text>

      <TouchableOpacity style={styles.voltarTopo} onPress={()=>navigation.goBack()}>
        <Text style={styles.textoVoltarTopo}>← Voltar</Text>
      </TouchableOpacity>
      {movements.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>
            Nenhuma movimentação cadastrada.
          </Text>
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.descricao}>
                {item.descricao}
              </Text>

              <Text style={styles.detalhe}>
                Categoria: {item.categoria}
              </Text>

              <Text style={styles.detalhe}>
                Tipo: {item.tipo === "receita" ? "Receita" : "Despesa"}
              </Text>

              <Text style={styles.detalhe}>
                Data: {formatarData(item.data)}
              </Text>

              <Text
                style={[
                  styles.valor,
                  item.tipo === "receita"
                    ? styles.receita
                    : styles.despesa,
                ]}
              >
                {item.tipo === "receita" ? "+ " : "- "}
                {moeda(item.valor)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F8",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003B71",
    marginBottom: 8,
  },
  orientacao: {
    color: "#5D6770",
    lineHeight: 20,
    marginBottom: 16,
  },
  voltarTopo:{paddingVertical:8},
  textoVoltarTopo:{color:"#003B71",fontWeight:"bold"},
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  descricao: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detalhe: {
    color: "#5D6770",
    marginTop: 4,
  },
  valor: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  receita: {
    color: "#188038",
  },
  despesa: {
    color: "#D71920",
  },
  vazio: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
  },
  textoVazio: {
    textAlign: "center",
    color: "#6B747C",
  },
});
