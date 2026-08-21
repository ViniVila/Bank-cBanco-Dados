# Ajuste visual da exportação

O botão **Exportar banco (.db)** agora aparece no topo da tela **Banco de Dados**, logo abaixo do nome do banco e da tabela. Assim ele fica visível sem precisar rolar até o final da página.

# CORREÇÃO — Exportação Web e Mobile

Nesta versão, a exportação foi corrigida para funcionar de forma diferente conforme a plataforma.

## Navegador / Web

O app **não usa `expo-file-system` para exportar o banco na Web**.

Em vez disso:

1. o `expo-sqlite` serializa o banco com `serializeAsync()`;
2. o navegador recebe os bytes do banco;
3. o app cria um arquivo binário `.db`;
4. o navegador faz o download de:

```text
senai_bank_aula_sqlite.db
```

Esse arquivo é um banco SQLite real e pode ser aberto no DB Browser for SQLite ou ferramenta equivalente.

## Android / iOS

O aplicativo continua usando:

```text
expo-file-system
expo-sharing
```

para copiar e compartilhar o arquivo físico do banco.

## Pacotes

```bash
npx expo install expo-sqlite expo-file-system expo-sharing
```


# SENAI Bank — Administrador + Exportação SQLite

Alterações:
- opção explícita de voltar nas telas operacionais;
- login administrativo antes do Console SQL: usuário `admin`, senha `12345`;
- exportação de uma cópia física `.db`;
- Extrato permanece somente leitura.

Instale também:

```bash
npx expo install expo-file-system expo-sharing
```

Ao tocar em **Exportar arquivo do banco (.db)**, o app prepara uma cópia e abre
o compartilhamento/seletor do sistema. No Android, escolha Arquivos/Downloads
para salvar o arquivo. Isso é necessário porque o Expo Go não deve gravar
silenciosamente na pasta pública Downloads.


# SENAI Bank — SQLite + Console SQL Didático

Nesta versão, a manutenção do banco é feita por uma área livre para comandos SQL.

Na tela **Banco de Dados**, o estudante pode escrever diretamente:

- SELECT
- INSERT
- UPDATE
- DELETE
- CREATE TABLE
- ALTER TABLE
- DROP TABLE
- PRAGMA

O Extrato agora é somente leitura: foram retirados os botões de edição e exclusão.

Exemplo:

```sql
SELECT * FROM movimentacoes ORDER BY id DESC;
```

```sql
INSERT INTO movimentacoes
(descricao, valor, tipo, categoria, data)
VALUES
('Bolsa auxílio', 1500, 'receita', 'Salário', datetime('now'));
```

```sql
UPDATE movimentacoes
SET valor = 1600
WHERE id = 1;
```

```sql
DELETE FROM movimentacoes
WHERE id = 1;
```

Após INSERT, UPDATE e DELETE, Dashboard e Extrato são recarregados a partir do banco.

> Atenção: os comandos digitados são executados de verdade no SQLite do aplicativo.



## IMPORTANTE — BANCO NOVO E VAZIO

Esta versão usa um novo arquivo de banco:

```text
senai_bank_aula_sqlite.db
```

Isso foi feito para evitar que registros persistidos de versões anteriores apareçam na aula.

Na primeira execução desta versão, a tabela `movimentacoes` começa vazia.

Depois que você cadastrar registros, eles permanecerão gravados normalmente entre as execuções do aplicativo.

# SENAI Bank — SQLite + CRUD + Visualizador Didático — CORRIGIDO

## O que foi corrigido

A versão anterior criava a tabela com `CREATE TABLE IF NOT EXISTS`.
Esse comando não altera uma tabela antiga que já exista no aparelho.

Se o estudante já tivesse executado uma versão anterior do SENAI Bank,
o arquivo `senai_bank_aula_sqlite.db` poderia conter uma tabela `movimentacoes`
com estrutura diferente. Nesse cenário, o `INSERT` podia falhar.

Esta versão:

- abre sempre o mesmo banco `senai_bank_aula_sqlite.db`;
- verifica a estrutura com `PRAGMA table_info(movimentacoes)`;
- adiciona automaticamente colunas que estiverem faltando;
- usa `runAsync()` com parâmetros em array;
- verifica `lastInsertRowId` e `changes`;
- só atualiza a interface depois que o `INSERT` termina;
- mostra erro de gravação na tela caso o SQLite rejeite o comando;
- mostra mensagem de sucesso após salvar;
- mantém uma única conexão com o banco;
- permite visualizar a estrutura real da tabela e seus registros.

## Dependência nova

Dentro do projeto:

```bash
npx expo install expo-sqlite
```

A navegação continua exigindo:

```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

## Execução recomendada nesta aula

```bash
npx expo start
```

Abra pelo **Expo Go no celular**.

## Teste obrigatório

1. Entre no app.
2. Cadastre:
   - descrição: Bolsa auxílio
   - valor: 1500,00
   - tipo: Receita
   - categoria: Salário
3. Salve.
4. Deve aparecer a mensagem:
   `Movimentação gravada no SQLite.`
5. Abra `Visualizar Banco SQLite`.
6. A tela deve mostrar:
   - estrutura da tabela;
   - `Registros reais encontrados: 1`;
   - os dados gravados.
7. Feche completamente o aplicativo.
8. Abra novamente.
9. O registro deve continuar aparecendo.

## Se quiser começar com um banco totalmente novo

A versão corrigida tenta preservar e migrar bancos antigos.

Se você quiser apagar todo o histórico anterior para uma demonstração
do zero, remova os dados do aplicativo/Expo Go no aparelho ou utilize
um novo nome de banco temporariamente.

## Fluxo

```text
FORMULÁRIO
    ↓
validação
    ↓
INSERT
    ↓
senai_bank_aula_sqlite.db
    ↓
SELECT
    ↓
setMovements()
    ↓
Dashboard / Extrato

Banco de Dados
    ↓
PRAGMA table_info
+
SELECT *
    ↓
estrutura + registros reais
```
