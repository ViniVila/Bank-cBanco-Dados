import { useCallback, useState } from "react";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { exportarBancoSQLite } from "../database/exportDatabase";

import {
  executarComandoSQL,
  listarMovimentacoes,
  obterEstruturaTabela,
} from "../database/database";

export default function DatabaseScreen({ navigation, onBancoAlterado }) {
  const [sql, setSql] = useState(
    "SELECT * FROM movimentacoes ORDER BY id DESC;"
  );

  const [resultado, setResultado] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [colunas, setColunas] = useState([]);
  const [registros, setRegistros] = useState([]);

  async function atualizarVisaoTabela() {
    try {
      const estrutura = await obterEstruturaTabela();
      const dados = await listarMovimentacoes();

      setColunas(estrutura);
      setRegistros(dados);
    } catch (e) {
      console.error("Erro ao atualizar tabela:", e);
    }
  }

  useFocusEffect(
    useCallback(() => {
      atualizarVisaoTabela();
    }, [])
  );

  async function executar() {
    try {
      setErro("");
      setMensagem("");
      setResultado([]);

      const retorno = await executarComandoSQL(sql);

      if (retorno.tipo === "consulta") {
        setResultado(retorno.registros);
        setMensagem(
          `Consulta executada. ${retorno.quantidade} registro(s) retornado(s).`
        );
      }

      if (retorno.tipo === "manutencao") {
        const id =
          retorno.lastInsertRowId !== undefined &&
          retorno.lastInsertRowId !== null
            ? ` | ID inserido: ${retorno.lastInsertRowId}`
            : "";

        setMensagem(
          `Comando executado. Linhas afetadas: ${retorno.changes}${id}`
        );
      }

      if (retorno.tipo === "estrutura") {
        setMensagem(retorno.mensagem);
      }

      await atualizarVisaoTabela();

      if (
        retorno.tipo === "manutencao" ||
        retorno.tipo === "estrutura"
      ) {
        if (onBancoAlterado) {
          await onBancoAlterado();
        }
      }
    } catch (e) {
      console.error("Erro SQL:", e);
      setErro(String(e));
    }
  }

  async function exportarBanco() {
    try {
      setErro(""); setMensagem("");
      await exportarBancoSQLite();

      if (Platform.OS === "web") {
        setMensagem(
          "Banco exportado. O arquivo .db foi enviado para a pasta de downloads do navegador."
        );
      } else {
        setMensagem(
          "Banco preparado. Escolha Arquivos/Downloads no menu do aparelho para salvar a cópia."
        );
      }
    } catch(e) { setErro(String(e)); }
  }

  function limparConsole() {
    setSql("");
    setResultado([]);
    setMensagem("");
    setErro("");
  }

  function preencherExemplo(tipo) {
    if (tipo === "SELECT") {
      setSql(
        "SELECT * FROM movimentacoes ORDER BY id DESC;"
      );
    }

    if (tipo === "INSERT") {
      setSql(
        `INSERT INTO movimentacoes
(descricao, valor, tipo, categoria, data)
VALUES
('Bolsa auxílio', 1500, 'receita', 'Salário', datetime('now'));`
      );
    }

    if (tipo === "UPDATE") {
      setSql(
        `UPDATE movimentacoes
SET valor = 1600
WHERE id = 1;`
      );
    }

    if (tipo === "DELETE") {
      setSql(
        `DELETE FROM movimentacoes
WHERE id = 1;`
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>
        Console SQL Didático
      </Text>

      <Text style={styles.descricao}>
        Digite os comandos SQL que deseja executar diretamente
        no banco do SENAI Bank.
      </Text>

      <View style={styles.infoBanco}>
        <Text style={styles.rotulo}>Banco:</Text>
        <Text style={styles.valorInfo}>
          senai_bank_aula_sqlite.db
        </Text>

        <Text style={styles.rotulo}>Tabela principal:</Text>
        <Text style={styles.valorInfo}>
          movimentacoes
        </Text>
      </View>

      <View style={styles.areaExportacao}>
        <Text style={styles.tituloExportacao}>
          Exportação do banco
        </Text>

        <Text style={styles.textoExportacao}>
          Gere uma cópia do arquivo SQLite para abrir e editar no DB Browser for SQLite.
        </Text>

        <TouchableOpacity
          style={styles.botaoExportar}
          onPress={exportarBanco}
        >
          <Text style={styles.textoBotaoExportar}>
            Exportar banco (.db)
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.secao}>
        Exemplos rápidos
      </Text>

      <View style={styles.exemplos}>
        {["SELECT", "INSERT", "UPDATE", "DELETE"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={styles.botaoExemplo}
              onPress={() => preencherExemplo(item)}
            >
              <Text style={styles.textoExemplo}>
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <Text style={styles.secao}>
        Digite seu comando SQL
      </Text>

      <TextInput
        style={styles.editor}
        value={sql}
        onChangeText={setSql}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        textAlignVertical="top"
        placeholder="Ex.: SELECT * FROM movimentacoes;"
      />

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoExecutar}
          onPress={executar}
        >
          <Text style={styles.textoBotaoExecutar}>
            Executar SQL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={limparConsole}
        >
          <Text style={styles.textoBotaoLimpar}>
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      {mensagem !== "" && (
        <View style={styles.sucesso}>
          <Text style={styles.textoSucesso}>
            {mensagem}
          </Text>
        </View>
      )}

      {erro !== "" && (
        <View style={styles.erroBox}>
          <Text style={styles.textoErro}>
            {erro}
          </Text>
        </View>
      )}

      {resultado.length > 0 && (
        <>
          <Text style={styles.secao}>
            Resultado do SELECT
          </Text>

          {resultado.map((item, indice) => (
            <View
              style={styles.registro}
              key={
                item.id !== undefined
                  ? String(item.id)
                  : String(indice)
              }
            >
              {Object.entries(item).map(
                ([campo, valor]) => (
                  <Text
                    style={styles.campo}
                    key={campo}
                  >
                    {campo} = {String(valor)}
                  </Text>
                )
              )}
            </View>
          ))}
        </>
      )}

      <Text style={styles.secao}>
        Estrutura atual da tabela
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        {colunas.map((coluna) => (
          <View
            key={String(coluna.cid)}
            style={styles.coluna}
          >
            <Text style={styles.colunaNome}>
              {coluna.name}
            </Text>

            <Text style={styles.colunaTipo}>
              {coluna.type}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.secao}>
        Registros atuais da tabela: {registros.length}
      </Text>

      {registros.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>
            Nenhum registro gravado.
          </Text>
        </View>
      ) : (
        registros.map((item) => (
          <View
            style={styles.registro}
            key={String(item.id)}
          >
            <Text style={styles.id}>
              ID: {item.id}
            </Text>

            <Text style={styles.campo}>
              descricao = {item.descricao}
            </Text>

            <Text style={styles.campo}>
              valor = {String(item.valor)}
            </Text>

            <Text style={styles.campo}>
              tipo = {item.tipo}
            </Text>

            <Text style={styles.campo}>
              categoria = {item.categoria}
            </Text>

            <Text style={styles.campo}>
              data = {item.data}
            </Text>
          </View>
        ))
      )}

      <View style={styles.aviso}>
        <Text style={styles.avisoTitulo}>
          Atenção
        </Text>

        <Text style={styles.avisoTexto}>
          Os comandos são executados diretamente no SQLite.
          UPDATE, DELETE, DROP e ALTER modificam de verdade
          o banco utilizado pelo aplicativo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  conteudo: {
    padding: 18,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#003B71",
  },
  descricao: {
    color: "#5D6770",
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 14,
  },
  infoBanco: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
  },
  rotulo: {
    color: "#6B747C",
    fontSize: 12,
  },
  valorInfo: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  secao: {
    color: "#003B71",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 18,
    marginBottom: 8,
  },
  exemplos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  botaoExemplo: {
    borderWidth: 1,
    borderColor: "#003B71",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textoExemplo: {
    color: "#003B71",
    fontWeight: "bold",
  },
  editor: {
    minHeight: 160,
    backgroundColor: "#1E2933",
    color: "#FFFFFF",
    fontFamily: "monospace",
    fontSize: 15,
    padding: 14,
    borderRadius: 10,
  },
  acoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  botaoExecutar: {
    flex: 1,
    backgroundColor: "#003B71",
    padding: 14,
    borderRadius: 10,
  },
  textoBotaoExecutar: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  botaoLimpar: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#003B71",
  },
  textoBotaoLimpar: {
    color: "#003B71",
    fontWeight: "bold",
  },
  sucesso: {
    backgroundColor: "#E9F7EE",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  textoSucesso: {
    color: "#176B37",
  },
  erroBox: {
    backgroundColor: "#FDECEC",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  textoErro: {
    color: "#B3261E",
  },
  registro: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  id: {
    color: "#003B71",
    fontWeight: "bold",
    marginBottom: 5,
  },
  campo: {
    fontFamily: "monospace",
    marginBottom: 3,
    color: "#333333",
  },
  coluna: {
    minWidth: 95,
    backgroundColor: "#E7EEF5",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  colunaNome: {
    color: "#003B71",
    fontWeight: "bold",
  },
  colunaTipo: {
    color: "#5D6770",
    fontSize: 12,
    marginTop: 3,
  },
  vazio: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
  },
  textoVazio: {
    textAlign: "center",
    color: "#5D6770",
  },
  areaExportacao: {
    backgroundColor: "#E9F7EE",
    borderWidth: 1,
    borderColor: "#A8D5B5",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  tituloExportacao: {
    color: "#176B37",
    fontSize: 17,
    fontWeight: "bold",
  },
  textoExportacao: {
    color: "#375543",
    marginTop: 5,
    marginBottom: 10,
    lineHeight: 19,
  },
  botaoExportar: {
    backgroundColor: "#176B37",
    padding: 14,
    borderRadius: 10,
  },
  textoBotaoExportar: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  botaoVoltar: {
    padding: 12,
    marginTop: 4,
  },
  textoVoltar: {
    textAlign: "center",
    color: "#003B71",
    fontWeight: "bold",
  },
  aviso: {
    backgroundColor: "#FFF3CD",
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
  },
  avisoTitulo: {
    fontWeight: "bold",
    color: "#7A5500",
  },
  avisoTexto: {
    color: "#6A520F",
    marginTop: 5,
    lineHeight: 20,
  },
});
