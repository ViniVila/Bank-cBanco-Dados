import { useMemo, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import StatementScreen from "./src/screens/StatementScreen";

const Stack = createNativeStackNavigator();


// ===============================================
// TELA DE MOVIMENTAÇÃO
// ===============================================

function MovementFormScreen({
  navigation,
  addMovement,
}) {

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [categoria, setCategoria] = useState("");

  // Mensagem de erro que aparecerá na tela
  const [erro, setErro] = useState("");

  const categorias = [
    "Alimentação",
    "Transporte",
    "Educação",
    "Salário",
    "Lazer",
    "Outros",
  ];


  // ===============================================
  // SALVAR MOVIMENTAÇÃO
  // ===============================================

  function salvarMovimentacao() {

    // Limpa mensagem anterior
    setErro("");


    if (!descricao.trim()) {

      setErro(
        "Digite uma descrição para a movimentação."
      );

      return;
    }


    if (!valor || Number(valor) <= 0) {

      setErro(
        "Digite um valor válido."
      );

      return;
    }


    if (!categoria) {

      setErro(
        "Selecione uma categoria."
      );

      return;
    }


    // Envia a movimentação para o App
    const resultado = addMovement({

      descricao: descricao,

      valor: valor,

      tipo: tipo,

      categoria: categoria,

    });


    // ============================================
    // SE O PAGAMENTO FOR MAIOR QUE O SALDO
    // MOSTRA O ERRO NA PRÓPRIA TELA
    // ============================================

    if (resultado.erro) {

      setErro(resultado.erro);

      return;
    }


    // Se deu tudo certo, volta para o Dashboard
    navigation.goBack();
  }


  return (

    <ScrollView
      contentContainerStyle={styles.formContainer}
    >

      <Text style={styles.titulo}>
        Nova movimentação
      </Text>


      {/* ==========================================
          MENSAGEM DE ERRO
      =========================================== */}

      {erro !== "" && (

        <View style={styles.erroContainer}>

          <Text style={styles.erroTitulo}>
            Pagamento não realizado
          </Text>

          <Text style={styles.erroTexto}>
            {erro}
          </Text>

        </View>

      )}


      {/* ==========================================
          DESCRIÇÃO
      =========================================== */}

      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Compra no supermercado"
        value={descricao}
        onChangeText={(texto) => {
          setDescricao(texto);
          setErro("");
        }}
      />


      {/* ==========================================
          VALOR
      =========================================== */}

      <Text style={styles.label}>
        Valor
      </Text>

      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        keyboardType="numeric"
        value={valor}
        onChangeText={(texto) => {
          setValor(texto);
          setErro("");
        }}
      />


      {/* ==========================================
          TIPO
      =========================================== */}

      <Text style={styles.label}>
        Tipo de movimentação
      </Text>


      <View style={styles.tipoContainer}>

        <TouchableOpacity
          style={[
            styles.tipoButton,

            tipo === "receita" &&
              styles.tipoSelecionado,
          ]}

          onPress={() => {
            setTipo("receita");
            setErro("");
          }}
        >

          <Text
            style={[
              styles.tipoTexto,

              tipo === "receita" &&
                styles.textoSelecionado,
            ]}
          >
            Receita
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.tipoButton,

            tipo === "despesa" &&
              styles.tipoSelecionado,
          ]}

          onPress={() => {
            setTipo("despesa");
            setErro("");
          }}
        >

          <Text
            style={[
              styles.tipoTexto,

              tipo === "despesa" &&
                styles.textoSelecionado,
            ]}
          >
            Despesa
          </Text>

        </TouchableOpacity>

      </View>


      {/* ==========================================
          CATEGORIAS
      =========================================== */}

      <Text style={styles.label}>
        Categoria
      </Text>


      <View style={styles.categoriasContainer}>

        {categorias.map((item) => (

          <TouchableOpacity
            key={item}

            style={[
              styles.categoriaButton,

              categoria === item &&
                styles.categoriaSelecionada,
            ]}

            onPress={() => {
              setCategoria(item);
              setErro("");
            }}
          >

            <Text
              style={[
                styles.categoriaTexto,

                categoria === item &&
                  styles.categoriaTextoSelecionado,
              ]}
            >
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>


      {/* ==========================================
          CATEGORIA SELECIONADA
      =========================================== */}

      {categoria !== "" && (

        <Text style={styles.categoriaAtual}>
          Categoria selecionada: {categoria}
        </Text>

      )}


      {/* ==========================================
          BOTÃO
      =========================================== */}

      <TouchableOpacity
        style={styles.salvarButton}
        onPress={salvarMovimentacao}
      >

        <Text style={styles.salvarTexto}>
          Salvar movimentação
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}


// ===============================================
// APLICATIVO
// ===============================================

export default function App() {

  const [movements, setMovements] = useState([]);


  // ===============================================
  // SALDO
  // ===============================================

  const saldo = useMemo(() => {

    return movements.reduce(
      (total, item) => {

        if (item.tipo === "receita") {

          return total + item.valor;

        }

        return total - item.valor;

      },

      0
    );

  }, [movements]);


  // ===============================================
  // ENTRADAS
  // ===============================================

  const entradas = useMemo(() => {

    return movements

      .filter(
        (item) =>
          item.tipo === "receita"
      )

      .reduce(
        (total, item) =>
          total + item.valor,

        0
      );

  }, [movements]);


  // ===============================================
  // SAÍDAS
  // ===============================================

  const saidas = useMemo(() => {

    return movements

      .filter(
        (item) =>
          item.tipo === "despesa"
      )

      .reduce(
        (total, item) =>
          total + item.valor,

        0
      );

  }, [movements]);


  // ===============================================
  // CONTADOR DE MOVIMENTAÇÕES
  // ===============================================
  // A quantidade muda automaticamente sempre que
  // uma nova receita ou despesa é adicionada.
  // ===============================================

  const quantidadeMovimentacoes =
    movements.length;


  // ===============================================
  // ADICIONAR MOVIMENTAÇÃO
  // ===============================================

  function addMovement(movement) {

    const valor = Number(
      movement.valor
    );


    // ============================================
    // VERIFICAÇÃO DE SALDO
    // ============================================

    if (
      movement.tipo === "despesa" &&
      valor > saldo
    ) {

      return {

        erro:
          `O valor a ser pago é de R$ ${valor.toFixed(
            2
          )}, mas o saldo disponível na conta é de R$ ${saldo.toFixed(
            2
          )}.`,

      };
    }


    // ============================================
    // CRIA MOVIMENTAÇÃO
    // ============================================

    const novaMovimentacao = {

      id:
        Date.now().toString(),

      descricao:
        movement.descricao.trim(),

      valor:
        valor,

      tipo:
        movement.tipo,

      categoria:
        movement.categoria,

      data:
        new Date().toISOString(),

    };


    // ============================================
    // ADICIONA MOVIMENTAÇÃO
    // ============================================

    setMovements(
      (listaAtual) => [

        novaMovimentacao,

        ...listaAtual,

      ]
    );


    return {
      sucesso: true,
    };
  }


  // ===============================================
  // NAVEGAÇÃO
  // ===============================================

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
      >


        {/* LOGIN */}

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />


        {/* DASHBOARD */}

        <Stack.Screen
          name="Dashboard"

          options={{
            title: "Minha Conta",

            headerBackVisible: false,
          }}
        >

          {(props) => (

            <View style={styles.dashboardContainer}>

              <DashboardScreen
                {...props}

                saldo={saldo}

                entradas={entradas}

                saidas={saidas}
              />


              {/* ==================================
                  CONTADOR DE MOVIMENTAÇÕES
              =================================== */}

              <View style={styles.movimentacoesCard}>

                <Text style={styles.movimentacoesTitulo}>
                  Movimentações realizadas
                </Text>

                <Text style={styles.movimentacoesNumero}>
                  {quantidadeMovimentacoes}
                </Text>

              </View>

            </View>

          )}

        </Stack.Screen>


        {/* MOVIMENTAÇÃO */}

        <Stack.Screen
          name="Movimentacao"

          options={{
            title:
              "Nova movimentação",
          }}
        >

          {(props) => (

            <MovementFormScreen
              {...props}

              addMovement={
                addMovement
              }

            />

          )}

        </Stack.Screen>


        {/* EXTRATO */}

        <Stack.Screen
          name="Extrato"

          options={{
            title: "Extrato",
          }}
        >

          {(props) => (

            <StatementScreen
              {...props}

              movements={
                movements
              }

            />

          )}

        </Stack.Screen>

      </Stack.Navigator>

    </NavigationContainer>
  );
}


// ===============================================
// ESTILOS
// ===============================================

const styles = StyleSheet.create({

  formContainer: {

    flexGrow: 1,

    padding: 20,

    backgroundColor: "#fff",
  },


  titulo: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 20,
  },


  // =============================================
  // ERRO
  // =============================================

  erroContainer: {

    backgroundColor: "#ffe5e5",

    borderWidth: 1,

    borderColor: "#ff3333",

    borderRadius: 8,

    padding: 15,

    marginBottom: 20,
  },


  erroTitulo: {

    color: "#cc0000",

    fontSize: 17,

    fontWeight: "bold",

    marginBottom: 5,
  },


  erroTexto: {

    color: "#990000",

    fontSize: 14,

    lineHeight: 20,
  },


  label: {

    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 8,

    marginTop: 10,
  },


  input: {

    borderWidth: 1,

    borderColor: "#ccc",

    borderRadius: 8,

    padding: 12,

    fontSize: 16,

    marginBottom: 10,
  },


  tipoContainer: {

    flexDirection: "row",

    gap: 10,

    marginBottom: 20,
  },


  tipoButton: {

    flex: 1,

    padding: 14,

    borderWidth: 1,

    borderColor: "#ccc",

    borderRadius: 8,

    alignItems: "center",
  },


  tipoSelecionado: {

    backgroundColor: "#222",

    borderColor: "#222",
  },


  tipoTexto: {

    fontSize: 16,

    fontWeight: "bold",
  },


  textoSelecionado: {

    color: "#fff",
  },


  categoriasContainer: {

    flexDirection: "row",

    flexWrap: "wrap",

    gap: 10,

    marginBottom: 10,
  },


  categoriaButton: {

    paddingVertical: 12,

    paddingHorizontal: 16,

    borderWidth: 1,

    borderColor: "#ccc",

    borderRadius: 20,
  },


  categoriaSelecionada: {

    backgroundColor: "#222",

    borderColor: "#222",
  },


  categoriaTexto: {

    fontSize: 14,
  },


  categoriaTextoSelecionado: {

    color: "#fff",

    fontWeight: "bold",
  },


  categoriaAtual: {

    fontSize: 14,

    marginTop: 5,

    marginBottom: 15,

    fontWeight: "bold",
  },


  salvarButton: {

    backgroundColor: "#222",

    padding: 16,

    borderRadius: 8,

    alignItems: "center",

    marginTop: 20,

    marginBottom: 30,
  },


  salvarTexto: {

    color: "#fff",

    fontSize: 16,

    fontWeight: "bold",
  },


  // =============================================
  // CONTADOR DE MOVIMENTAÇÕES
  // =============================================

  dashboardContainer: {

    flex: 1,

    backgroundColor: "#fff",
  },


  movimentacoesCard: {

    marginHorizontal: 20,

    marginBottom: 20,

    padding: 18,

    borderRadius: 10,

    backgroundColor: "#f2f2f2",

    borderWidth: 1,

    borderColor: "#ddd",

    alignItems: "center",
  },


  movimentacoesTitulo: {

    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 8,
  },


  movimentacoesNumero: {

    fontSize: 30,

    fontWeight: "bold",
  },

});