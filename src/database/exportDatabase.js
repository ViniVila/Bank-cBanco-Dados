// ===============================================
// EXPORTAÇÃO DO BANCO SQLITE
// Compatível com Web + Android/iOS
// ===============================================

import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { obterBanco } from "./database";

const NOME_BANCO = "senai_bank_aula_sqlite.db";

// -------------------------------------------------
// WEB
// -------------------------------------------------
// No navegador não usamos expo-file-system.
// Serializamos o SQLite em memória e criamos um Blob,
// que o navegador baixa como um arquivo .db real.
async function exportarNaWeb() {
  const db = await obterBanco();

  // Retorna o banco inteiro como Uint8Array.
  const bytes = await db.serializeAsync();

  // Cria um arquivo binário SQLite no navegador.
  const blob = new Blob(
    [bytes],
    { type: "application/x-sqlite3" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = NOME_BANCO;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return NOME_BANCO;
}

// -------------------------------------------------
// ANDROID / IOS
// -------------------------------------------------
// No dispositivo móvel copiamos o arquivo físico para
// uma área temporária e abrimos o compartilhamento.
// O usuário escolhe Downloads / Arquivos / Drive etc.
async function exportarNoDispositivo() {
  const origem =
    `${FileSystem.documentDirectory}SQLite/${NOME_BANCO}`;

  const destino =
    `${FileSystem.cacheDirectory}${NOME_BANCO}`;

  const info =
    await FileSystem.getInfoAsync(origem);

  if (!info.exists) {
    throw new Error(
      "Arquivo físico do banco SQLite não foi localizado."
    );
  }

  await FileSystem.copyAsync({
    from: origem,
    to: destino,
  });

  const disponivel =
    await Sharing.isAvailableAsync();

  if (!disponivel) {
    throw new Error(
      "O compartilhamento de arquivos não está disponível neste dispositivo."
    );
  }

  await Sharing.shareAsync(destino, {
    mimeType: "application/x-sqlite3",
    dialogTitle: "Salvar banco SENAI Bank",
    UTI: "public.database",
  });

  return destino;
}

// -------------------------------------------------
// FUNÇÃO PRINCIPAL
// -------------------------------------------------
export async function exportarBancoSQLite() {
  if (Platform.OS === "web") {
    return await exportarNaWeb();
  }

  return await exportarNoDispositivo();
}
