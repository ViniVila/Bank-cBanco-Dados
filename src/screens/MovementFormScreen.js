import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categorias = [
  "Salário",
  "Alimentação",
  "Transporte",
  "Educação",
  "Lazer",
  "Outros",
];

export default function MovementFormScreen({
  navigation,
  route,
  saldo,
  addMovement,
  updateMovement,
}) {
  const movimentoEdicao = route.params?.movement ?? null;

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [categoria, setCategoria] = useState("Outros");

  useEffect(() => {
    if (movimentoEdicao) {
      setDescricao(movimentoEdicao.descricao);
      setValor(String(movimentoEdicao.valor).replace(".", ","));
      setTipo(movimentoEdicao.tipo);
      setCategoria(movimentoEdicao.categoria);
    }
  }, [movimentoEdicao]);

  function mostrarMensagem(titulo, mensagem) {
    if (Platform.OS === "web") {
      alert(`${titulo}\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  function converterValor(texto) {
    const normalizado = texto
      .trim()
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return Number(normalizado);
  }

  async function salvar() {
    const valorNumerico = converterValor(valor);

    if (descricao.trim() === "") {
      mostrarMensagem("Atenção", "Digite a descrição.");
      return;
    }

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      mostrarMensagem("Atenção", "Digite um valor maior que zero.");
      return;
    }

    // Para validar edição, retiramos do saldo o efeito
    // da movimentação original antes de testar o novo valor.
    let saldoDisponivel = saldo;

    if (movimentoEdicao) {
      if (movimentoEdicao.tipo === "receita") {
        saldoDisponivel =
          saldo - Number(movimentoEdicao.valor);
      } else {
        saldoDisponivel =
          saldo + Number(movimentoEdicao.valor);
      }
    }

    if (
      tipo === "despesa" &&
      valorNumerico > saldoDisponivel
    ) {
      mostrarMensagem(
        "Operação não permitida",
        "Saldo insuficiente para esta despesa."
      );
      return;
    }

    try {
      if (movimentoEdicao) {
      await updateMovement({
        id: movimentoEdicao.id,
        descricao,
        valor: valorNumerico,
        tipo,
        categoria,
      });
      } else {
        await addMovement({
          descricao,
          valor: valorNumerico,
          tipo,
          categoria,
        });
      }

      mostrarMensagem(
        "Sucesso",
        movimentoEdicao
          ? "Movimentação atualizada no SQLite."
          : "Movimentação gravada no SQLite."
      );

      navigation.goBack();
    } catch (erro) {
      // O App.js já mostra o erro detalhado.
      // Aqui apenas impedimos que a tela volte
      // se a gravação falhar.
      console.error("Falha ao salvar:", erro);
    }
  }

  function limparCampos() {
    setDescricao("");
    setValor("");
    setTipo("receita");
    setCategoria("Outros");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.voltarTopo} onPress={()=>navigation.goBack()}>
        <Text style={styles.textoVoltarTopo}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>
        {movimentoEdicao ? "Editar movimentação" : "Nova movimentação"}
      </Text>

      <Text style={styles.rotulo}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Material escolar"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.rotulo}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 150,00"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />

      <Text style={styles.rotulo}>Tipo</Text>

      <View style={styles.linha}>
        <TouchableOpacity
          style={[
            styles.opcao,
            tipo === "receita" && styles.opcaoAtiva,
          ]}
          onPress={() => setTipo("receita")}
        >
          <Text
            style={[
              styles.textoOpcao,
              tipo === "receita" && styles.textoOpcaoAtiva,
            ]}
          >
            Receita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.opcao,
            tipo === "despesa" && styles.opcaoAtiva,
          ]}
          onPress={() => setTipo("despesa")}
        >
          <Text
            style={[
              styles.textoOpcao,
              tipo === "despesa" && styles.textoOpcaoAtiva,
            ]}
          >
            Despesa
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rotuloCategoria}>Categoria</Text>

      <View style={styles.categorias}>
        {categorias.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoria,
              categoria === item && styles.categoriaAtiva,
            ]}
            onPress={() => setCategoria(item)}
          >
            <Text
              style={[
                styles.textoCategoria,
                categoria === item && styles.textoCategoriaAtiva,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.textoBotaoSalvar}>
          {movimentoEdicao ? "Atualizar" : "Salvar movimentação"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLimpar} onPress={limparCampos}>
        <Text style={styles.textoBotaoLimpar}>Limpar campos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F4F6F8",
  },
  voltarTopo:{paddingVertical:8},
  textoVoltarTopo:{color:"#003B71",fontWeight:"bold"},
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003B71",
    marginBottom: 24,
  },
  rotulo: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  rotuloCategoria: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7DCE0",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
  linha: {
    flexDirection: "row",
    gap: 12,
  },
  opcao: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#003B71",
    padding: 12,
    borderRadius: 10,
  },
  opcaoAtiva: {
    backgroundColor: "#003B71",
  },
  textoOpcao: {
    color: "#003B71",
    textAlign: "center",
    fontWeight: "bold",
  },
  textoOpcaoAtiva: {
    color: "#FFFFFF",
  },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoria: {
    borderWidth: 1,
    borderColor: "#003B71",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  categoriaAtiva: {
    backgroundColor: "#003B71",
  },
  textoCategoria: {
    color: "#003B71",
  },
  textoCategoriaAtiva: {
    color: "#FFFFFF",
  },
  botaoSalvar: {
    backgroundColor: "#D71920",
    padding: 16,
    borderRadius: 10,
    marginTop: 28,
  },
  textoBotaoSalvar: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  botaoLimpar: {
    borderWidth: 2,
    borderColor: "#003B71",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  textoBotaoLimpar: {
    color: "#003B71",
    textAlign: "center",
    fontWeight: "bold",
  },
});
