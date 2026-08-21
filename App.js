// ===============================================
// SENAI BANK - SQLITE + CRUD + VISUALIZAÇÃO DIDÁTICA
// VERSÃO CORRIGIDA
// ===============================================

import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import MovementFormScreen from "./src/screens/MovementFormScreen";
import StatementScreen from "./src/screens/StatementScreen";
import DatabaseScreen from "./src/screens/DatabaseScreen";
import AdminLoginScreen from "./src/screens/AdminLoginScreen";

import {
  iniciarBanco,
  listarMovimentacoes,
  inserirMovimentacao,
  atualizarMovimentacao,
  excluirMovimentacao,
} from "./src/database/database";

const Stack = createNativeStackNavigator();

export default function App() {
  // movements continua sendo o estado que alimenta a interface.
  // A diferença é que agora seus dados vêm do SQLite.
  const [movements, setMovements] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erroBanco, setErroBanco] = useState("");

  useEffect(() => {
    async function prepararBanco() {
      try {
        await iniciarBanco();

        const dados = await listarMovimentacoes();

        setMovements(dados);
      } catch (erro) {
        console.error("Erro ao iniciar banco:", erro);
        setErroBanco(String(erro));
      } finally {
        setCarregando(false);
      }
    }

    prepararBanco();
  }, []);

  function mostrarMensagem(titulo, mensagem) {
    if (Platform.OS === "web") {
      alert(`${titulo}\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  // -------------------------------------------------
  // SELECT - atualiza a interface a partir do banco
  // -------------------------------------------------
  async function atualizarLista() {
    const dados = await listarMovimentacoes();
    setMovements(dados);
  }

  // -------------------------------------------------
  // CREATE
  // -------------------------------------------------
  async function addMovement(movement) {
    try {
      const resultado = await inserirMovimentacao(movement);

      // Só depois do INSERT ser concluído fazemos SELECT.
      await atualizarLista();

      return resultado;
    } catch (erro) {
      console.error("Erro no INSERT:", erro);

      mostrarMensagem(
        "Erro ao gravar",
        `A movimentação não foi gravada.\n${String(erro)}`
      );

      throw erro;
    }
  }

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------
  async function updateMovement(movement) {
    try {
      await atualizarMovimentacao(movement);
      await atualizarLista();
    } catch (erro) {
      console.error("Erro no UPDATE:", erro);

      mostrarMensagem(
        "Erro ao atualizar",
        String(erro)
      );

      throw erro;
    }
  }

  // -------------------------------------------------
  // DELETE
  // -------------------------------------------------
  async function deleteMovement(id) {
    try {
      await excluirMovimentacao(id);
      await atualizarLista();
    } catch (erro) {
      console.error("Erro no DELETE:", erro);

      mostrarMensagem(
        "Erro ao excluir",
        String(erro)
      );

      throw erro;
    }
  }

  const saldo = useMemo(() => {
    return movements.reduce((total, item) => {
      return item.tipo === "receita"
        ? total + Number(item.valor)
        : total - Number(item.valor);
    }, 0);
  }, [movements]);

  const entradas = useMemo(() => {
    return movements
      .filter((item) => item.tipo === "receita")
      .reduce(
        (total, item) => total + Number(item.valor),
        0
      );
  }, [movements]);

  const saidas = useMemo(() => {
    return movements
      .filter((item) => item.tipo === "despesa")
      .reduce(
        (total, item) => total + Number(item.valor),
        0
      );
  }, [movements]);

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" />

        <Text style={styles.texto}>
          Preparando o banco de dados...
        </Text>
      </View>
    );
  }

  if (erroBanco !== "") {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erroTitulo}>
          Erro ao abrir o SQLite
        </Text>

        <Text style={styles.erroTexto}>
          {erroBanco}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Dashboard"
          options={{
            title: "Minha Conta",
            headerBackVisible: false,
          }}
        >
          {(props) => (
            <DashboardScreen
              {...props}
              saldo={saldo}
              entradas={entradas}
              saidas={saidas}
              totalMovimentacoes={movements.length}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Movimentacao"
          options={{ title: "Movimentação" }}
        >
          {(props) => (
            <MovementFormScreen
              {...props}
              saldo={saldo}
              addMovement={addMovement}
              updateMovement={updateMovement}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Extrato"
          options={{ title: "Extrato" }}
        >
          {(props) => (
            <StatementScreen
              {...props}
              movements={movements}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Administrador" }}
        />

        <Stack.Screen
          name="BancoDados"
          options={{ title: "Banco de Dados" }}
        >
          {(props) => (
            <DatabaseScreen
              {...props}
              onBancoAlterado={atualizarLista}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F6F8",
  },

  texto: {
    marginTop: 15,
    fontSize: 16,
  },

  erroTitulo: {
    color: "#D71920",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
  },

  erroTexto: {
    textAlign: "center",
    color: "#333333",
  },
});
