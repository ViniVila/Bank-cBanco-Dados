import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function mostrarMensagem(titulo, mensagem) {
    if (Platform.OS === "web") {
      alert(`${titulo}\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  function entrar() {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPin = /^\d{4}$/;

    if (!regexEmail.test(email)) {
      mostrarMensagem("Atenção", "Digite um e-mail válido.");
      return;
    }

    if (!regexPin.test(senha)) {
      mostrarMensagem("Atenção", "O PIN deve possuir 4 números.");
      return;
    }

    navigation.replace("Dashboard");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SENAI Bank</Text>
      <Text style={styles.subtitulo}>Acesse sua conta educacional</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite seu PIN de 4 números"
        value={senha}
        onChangeText={setSenha}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={entrar}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Login demonstrativo para fins educacionais.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#003B71",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitulo: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  botao: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#003B71",
    textAlign: "center",
    fontWeight: "bold",
  },
  rodape: {
    color: "#D8E5EF",
    textAlign: "center",
    marginTop: 18,
    fontSize: 12,
  },
});
