// ===============================================
// BANCO DE DADOS - SENAI BANK
// SQLite + CRUD - VERSÃO CORRIGIDA
// ===============================================
//
// Esta versão também faz MIGRAÇÃO da tabela.
// Isso é importante quando o estudante já executou
// uma versão anterior do SENAI Bank e o arquivo
// senai_bank_aula_sqlite.db já existe no aparelho.
// ===============================================

import * as SQLite from "expo-sqlite";

// NENHUM REGISTRO PADRÃO é inserido automaticamente.
// O banco começa vazio na primeira execução desta versão.

// Mantemos uma única conexão com o banco.
let banco = null;

// -------------------------------------------------
// ABRIR / RECUPERAR CONEXÃO
// -------------------------------------------------
export async function obterBanco() {
  if (banco) {
    return banco;
  }

  banco = await SQLite.openDatabaseAsync("senai_bank_aula_sqlite.db");

  return banco;
}

// -------------------------------------------------
// GARANTIR A ESTRUTURA DA TABELA
// -------------------------------------------------
async function garantirEstrutura(db) {
  // Cria a tabela completa quando ela ainda não existe.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL DEFAULT 0,
      tipo TEXT NOT NULL DEFAULT 'receita',
      categoria TEXT NOT NULL DEFAULT 'Outros',
      data TEXT NOT NULL DEFAULT ''
    );
  `);

  // Descobre quais colunas existem na tabela atual.
  const colunas = await db.getAllAsync(
    "PRAGMA table_info(movimentacoes);"
  );

  const nomes = colunas.map((coluna) => coluna.name);

  // Se o aluno já possuía uma versão antiga da tabela,
  // adicionamos as colunas que estiverem faltando.
  if (!nomes.includes("descricao")) {
    await db.execAsync(
      "ALTER TABLE movimentacoes ADD COLUMN descricao TEXT NOT NULL DEFAULT 'Sem descrição';"
    );
  }

  if (!nomes.includes("valor")) {
    await db.execAsync(
      "ALTER TABLE movimentacoes ADD COLUMN valor REAL NOT NULL DEFAULT 0;"
    );
  }

  if (!nomes.includes("tipo")) {
    await db.execAsync(
      "ALTER TABLE movimentacoes ADD COLUMN tipo TEXT NOT NULL DEFAULT 'receita';"
    );
  }

  if (!nomes.includes("categoria")) {
    await db.execAsync(
      "ALTER TABLE movimentacoes ADD COLUMN categoria TEXT NOT NULL DEFAULT 'Outros';"
    );
  }

  if (!nomes.includes("data")) {
    await db.execAsync(
      "ALTER TABLE movimentacoes ADD COLUMN data TEXT NOT NULL DEFAULT '';"
    );
  }

  // Registros antigos recebem valores padrão.
  await db.execAsync(`
    UPDATE movimentacoes
       SET categoria = 'Outros'
     WHERE categoria IS NULL OR categoria = '';

    UPDATE movimentacoes
       SET data = datetime('now')
     WHERE data IS NULL OR data = '';
  `);
}

// -------------------------------------------------
// INICIAR BANCO
// -------------------------------------------------
export async function iniciarBanco() {
  const db = await obterBanco();

  // Melhora o comportamento do SQLite.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  await garantirEstrutura(db);

  return db;
}

// -------------------------------------------------
// CREATE - INSERT
// -------------------------------------------------
export async function inserirMovimentacao(movement) {
  const db = await obterBanco();

  const descricao = movement.descricao.trim();
  const valor = Number(movement.valor);
  const tipo = movement.tipo;
  const categoria = movement.categoria || "Outros";
  const data = new Date().toISOString();

  // runAsync retorna informações sobre a gravação.
  const resultado = await db.runAsync(
    `
    INSERT INTO movimentacoes
      (descricao, valor, tipo, categoria, data)
    VALUES
      (?, ?, ?, ?, ?);
    `,
    [descricao, valor, tipo, categoria, data]
  );

  console.log(
    "INSERT realizado. ID:",
    resultado.lastInsertRowId,
    "Linhas alteradas:",
    resultado.changes
  );

  return resultado;
}

// -------------------------------------------------
// READ - SELECT
// -------------------------------------------------
export async function listarMovimentacoes() {
  const db = await obterBanco();

  const dados = await db.getAllAsync(`
    SELECT
      id,
      descricao,
      valor,
      tipo,
      categoria,
      data
    FROM movimentacoes
    ORDER BY id DESC;
  `);

  return dados;
}

// -------------------------------------------------
// UPDATE
// -------------------------------------------------
export async function atualizarMovimentacao(movement) {
  const db = await obterBanco();

  const resultado = await db.runAsync(
    `
    UPDATE movimentacoes
       SET descricao = ?,
           valor = ?,
           tipo = ?,
           categoria = ?
     WHERE id = ?;
    `,
    [
      movement.descricao.trim(),
      Number(movement.valor),
      movement.tipo,
      movement.categoria || "Outros",
      movement.id,
    ]
  );

  return resultado;
}

// -------------------------------------------------
// DELETE
// -------------------------------------------------
export async function excluirMovimentacao(id) {
  const db = await obterBanco();

  const resultado = await db.runAsync(
    `
    DELETE FROM movimentacoes
    WHERE id = ?;
    `,
    [id]
  );

  return resultado;
}

// -------------------------------------------------
// INFORMAÇÕES DIDÁTICAS DO BANCO
// -------------------------------------------------
export async function obterEstruturaTabela() {
  const db = await obterBanco();

  return await db.getAllAsync(
    "PRAGMA table_info(movimentacoes);"
  );
}


// -------------------------------------------------
// CONSOLE SQL DIDÁTICO
// -------------------------------------------------
export async function executarComandoSQL(sql) {
  const db = await obterBanco();

  const comando = sql.trim();

  if (comando === "") {
    throw new Error("Digite um comando SQL.");
  }

  const primeiraPalavra =
    comando.split(/\s+/)[0].toUpperCase();

  if (
    primeiraPalavra === "SELECT" ||
    primeiraPalavra === "PRAGMA" ||
    primeiraPalavra === "WITH"
  ) {
    const registros = await db.getAllAsync(comando);

    return {
      tipo: "consulta",
      registros,
      quantidade: registros.length,
    };
  }

  if (
    primeiraPalavra === "INSERT" ||
    primeiraPalavra === "UPDATE" ||
    primeiraPalavra === "DELETE"
  ) {
    const resultado = await db.runAsync(comando);

    return {
      tipo: "manutencao",
      changes: resultado.changes,
      lastInsertRowId: resultado.lastInsertRowId,
    };
  }

  await db.execAsync(comando);

  return {
    tipo: "estrutura",
    mensagem: "Comando executado com sucesso.",
  };
}
