<div align="center">

# 🏦 SENAI Bank — Banco de Dados Relacional (SQLite)

![SQLite](https://img.shields.io/badge/SQLite-3-07405e?style=for-the-badge&logo=sqlite&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-CRUD%20%2B%20JOIN-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)

![plataformas](https://img.shields.io/badge/plataformas-Android%20%7C%20iOS%20%7C%20Web-2ea44f?style=flat-square)
![relacionamento](https://img.shields.io/badge/relacionamento-1%3AN-2ea44f?style=flat-square)
![tipo](https://img.shields.io/badge/tipo-atividade%20acadêmica-1e90ff?style=flat-square)
![dupla](https://img.shields.io/badge/modalidade-dupla-1e90ff?style=flat-square)
![licença](https://img.shields.io/badge/licença-MIT-lightgrey?style=flat-square)

</div>

---

## 📌 Sobre o projeto

O **SENAI Bank** evoluiu de uma tabela única de movimentações para um
**banco de dados relacional** completo, capaz de identificar corretamente
**quem** é o cliente e **em qual conta** cada movimentação ocorreu.

O banco agora conta com três tabelas relacionadas por chave primária e
chave estrangeira:

- 👤 Cadastro de **clientes**;
- 💳 **Contas** vinculadas a cada cliente;
- 💰 **Movimentações** (receitas e despesas) vinculadas a cada conta;
- 🔗 Consultas com `INNER JOIN` unindo as três tabelas;
- 🧮 Cálculo automático de receitas, despesas e saldo por conta;
- 🛠️ CRUD completo (`INSERT`, `SELECT`, `UPDATE`, `DELETE`) via console SQL do app.

---

## 🧩 Modelagem do banco

```
┌─────────────────────────┐
│        CLIENTES         │
│──────────────────────────│
│ PK id_cliente            │
│    nome                  │
│    email                 │
└────────────┬─────────────┘
             │ 1
             │ possui
             │ N
┌────────────▼─────────────┐
│          CONTAS           │
│───────────────────────────│
│ PK id_conta                │
│    numero_conta            │
│    saldo_inicial           │
│ FK id_cliente ──► clientes │
└────────────┬───────────────┘
             │ 1
             │ possui
             │ N
┌────────────▼─────────────────┐
│        MOVIMENTACOES          │
│────────────────────────────────│
│ PK id                          │
│    descricao                   │
│    valor                       │
│    tipo                        │
│    categoria                   │
│    data                        │
│ FK id_conta ──► contas         │
└─────────────────────────────────┘
```

| Relacionamento | Cardinalidade |
|---|---|
| `clientes` → `contas` | 1 cliente para N contas |
| `contas` → `movimentacoes` | 1 conta para N movimentações |

---

## 🗂️ Estrutura das tabelas

```sql
CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE contas (
    id_conta INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_conta TEXT NOT NULL UNIQUE,
    saldo_inicial REAL NOT NULL,
    id_cliente INTEGER NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data TEXT NOT NULL,
    id_conta INTEGER NOT NULL,
    FOREIGN KEY (id_conta) REFERENCES contas(id_conta)
);
```

### 📊 Dados já populados no banco entregue

| Cliente | Conta | Movimentações |
|---|:---:|:---:|
| João Santos | `10001` | 3 |
| Ana Lima | `10002` | 3 |
| Carlos Eduardo | `10003` | 4 |

**Total:** 3 clientes · 3 contas · 10 movimentações (receitas e despesas)

---

## ▶️ Como executar o projeto

```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-sqlite expo-file-system expo-sharing

npx expo start
```

Abra pelo **Expo Go** no celular ou em um emulador.

> O app abre sempre o mesmo arquivo `senai_bank_aula_sqlite.db`, verifica a
> estrutura com `PRAGMA table_info` e adiciona automaticamente colunas
> faltantes — evitando falha de `INSERT` em bancos de versões anteriores.

---

## 🖥️ Console SQL do app

Tela **Banco de Dados** — acesso administrativo:

![usuário](https://img.shields.io/badge/usuário-admin-333?style=flat-square)
![senha](https://img.shields.io/badge/senha-12345-333?style=flat-square)

Comandos suportados diretamente no app:

`SELECT` · `INSERT` · `UPDATE` · `DELETE` · `CREATE TABLE` · `ALTER TABLE` · `DROP TABLE` · `PRAGMA`

Após `INSERT`, `UPDATE` ou `DELETE`, o Dashboard e o Extrato são recarregados
automaticamente. O Extrato é **somente leitura** (sem edição/exclusão pela UI).

> ⚠️ Os comandos são executados de verdade no SQLite do app — não há simulação.

---

## 📤 Exportação do banco (.db)

O botão **Exportar banco (.db)** fica no topo da tela **Banco de Dados**.

| Plataforma | Como funciona |
|---|---|
| 🌐 **Web** | `expo-sqlite` serializa o banco com `serializeAsync()` e o navegador baixa `senai_bank_aula_sqlite.db`, que pode ser aberto no DB Browser for SQLite. |
| 📱 **Android / iOS** | `expo-file-system` + `expo-sharing` copiam o arquivo físico e abrem o compartilhamento do sistema (no Android, salvar em Arquivos/Downloads). |

---

## 🔁 CRUD demonstrado

```sql
-- CREATE
INSERT INTO movimentacoes (descricao, valor, tipo, categoria, data, id_conta)
VALUES ('Teste Cinema', 40.00, 'Despesa', 'Lazer', '2026-08-08', 1);

-- READ
SELECT * FROM movimentacoes WHERE id = 11;

-- UPDATE
UPDATE clientes SET email = 'joao.santos@senai.com' WHERE id_cliente = 1;

-- DELETE
DELETE FROM movimentacoes WHERE id = 11;
```

---

## 🔎 Consultas obrigatórias (1 a 10)

**1. Quais clientes estão cadastrados?**
```sql
SELECT * FROM clientes;
```

**2. Quais contas pertencem a cada cliente?**
```sql
SELECT c.nome, ct.numero_conta
FROM clientes c
INNER JOIN contas ct ON c.id_cliente = ct.id_cliente;
```

**3. Quais movimentações pertencem a determinada conta?** *(ex.: `id_conta = 1`)*
```sql
SELECT * FROM movimentacoes WHERE id_conta = 1;
```

**4. Quem é o cliente responsável por determinada movimentação?** *(ex.: `id = 1`)*
```sql
SELECT c.nome, m.descricao, m.valor
FROM movimentacoes m
INNER JOIN contas ct ON m.id_conta = ct.id_conta
INNER JOIN clientes c ON ct.id_cliente = c.id_cliente
WHERE m.id = 1;
```

**5. Quais movimentações são receitas?**
```sql
SELECT * FROM movimentacoes WHERE tipo = 'Receita';
```

**6. Quais movimentações são despesas?**
```sql
SELECT * FROM movimentacoes WHERE tipo = 'Despesa';
```

**7. Qual o total de receitas de uma conta?** *(ex.: `id_conta = 1`)*
```sql
SELECT SUM(valor) AS total_receitas
FROM movimentacoes
WHERE tipo = 'Receita' AND id_conta = 1;
```

**8. Qual o total de despesas de uma conta?** *(ex.: `id_conta = 1`)*
```sql
SELECT SUM(valor) AS total_despesas
FROM movimentacoes
WHERE tipo = 'Despesa' AND id_conta = 1;
```

**9. Qual o saldo calculado de uma conta?** *(ex.: `id_conta = 1`)*
```sql
SELECT
    SUM(CASE WHEN tipo = 'Receita' THEN valor ELSE 0 END) -
    SUM(CASE WHEN tipo = 'Despesa' THEN valor ELSE 0 END) AS saldo_calculado
FROM movimentacoes
WHERE id_conta = 1;
```

**10. Cliente + conta + movimentações em uma única consulta com `INNER JOIN`**
```sql
SELECT
    c.nome AS Cliente,
    ct.numero_conta AS Conta,
    m.descricao AS Descricao,
    m.tipo AS Tipo,
    m.valor AS Valor
FROM clientes c
INNER JOIN contas ct ON c.id_cliente = ct.id_cliente
INNER JOIN movimentacoes m ON ct.id_conta = m.id_conta;
```

<details>
<summary>📋 Resultado esperado da consulta 10</summary>

| Cliente | Conta | Descrição | Tipo | Valor |
|---|:---:|---|---|---:|
| João Santos | 10001 | Salário | Receita | 2500.00 |
| João Santos | 10001 | Supermercado | Despesa | 350.00 |
| João Santos | 10001 | Transporte | Despesa | 150.00 |
| Ana Lima | 10002 | Bolsa auxílio | Receita | 1800.00 |
| Ana Lima | 10002 | Farmácia | Despesa | 120.00 |
| Ana Lima | 10002 | Pix Recebido | Receita | 500.00 |
| Carlos Eduardo | 10003 | Projeto Freelance | Receita | 3000.00 |
| Carlos Eduardo | 10003 | Conta de Luz | Despesa | 210.00 |
| Carlos Eduardo | 10003 | Restaurante | Despesa | 90.00 |
| Carlos Eduardo | 10003 | Internet | Despesa | 130.00 |

</details>

---

## 🏆 Desafio adicional — relatório financeiro

Consulta que apresenta `CLIENTE | CONTA | RECEITAS | DESPESAS | SALDO` por
conta, usando `SUM`, `CASE`, `GROUP BY` e `LEFT JOIN`:

```sql
SELECT
    c.nome AS CLIENTE,
    ct.numero_conta AS CONTA,
    COALESCE(SUM(CASE WHEN m.tipo = 'Receita' THEN m.valor ELSE 0 END), 0) AS RECEITAS,
    COALESCE(SUM(CASE WHEN m.tipo = 'Despesa' THEN m.valor ELSE 0 END), 0) AS DESPESAS,
    (ct.saldo_inicial +
     COALESCE(SUM(CASE WHEN m.tipo = 'Receita' THEN m.valor ELSE 0 END), 0) -
     COALESCE(SUM(CASE WHEN m.tipo = 'Despesa' THEN m.valor ELSE 0 END), 0)) AS SALDO
FROM clientes c
INNER JOIN contas ct ON c.id_cliente = ct.id_cliente
LEFT JOIN movimentacoes m ON ct.id_conta = m.id_conta
GROUP BY c.id_cliente, ct.id_conta;
```

<details>
<summary>📋 Resultado esperado</summary>

| CLIENTE | CONTA | RECEITAS | DESPESAS | SALDO |
|---|:---:|---:|---:|---:|
| João Santos | 10001 | 2500.00 | 500.00 | 2000.00 |
| Ana Lima | 10002 | 2300.00 | 120.00 | 2180.00 |
| Carlos Eduardo | 10003 | 3000.00 | 430.00 | 2570.00 |

</details>

> 💡 O `LEFT JOIN` garante que contas sem nenhuma movimentação ainda apareçam
> no relatório, com receitas/despesas zeradas.

---

## 📱 Integração com o app

Pelo menos uma tela do app consome os dados relacionados (cliente + conta +
extrato):

```
SENAI Bank
Cliente: João Santos
Conta: 10001
────────────────────────────
Salário          Receita   + R$ 2.500,00
Supermercado     Despesa   − R$ 350,00
Transporte       Despesa   − R$ 150,00
```

---

## ✅ Checklist de entrega

- [x] Criação das três tabelas (`clientes`, `contas`, `movimentacoes`)
- [x] Chaves primárias (`id_cliente`, `id_conta`, `id`)
- [x] Chaves estrangeiras (`contas.id_cliente`, `movimentacoes.id_conta`)
- [x] Cadastro de 3 clientes
- [x] Cadastro de 3 contas (uma por cliente)
- [x] Cadastro de 10 movimentações (receitas e despesas)
- [x] `INSERT`, `SELECT`, `UPDATE` e `DELETE` funcionando
- [x] Consulta com `INNER JOIN` (clientes + contas + movimentações)
- [x] Relatório com `SUM`, `CASE` e `GROUP BY`
- [ ] Capturas de tela / evidências no app
- [ ] Arquivo `.db` exportado anexado à entrega
- [ ] Breve explicação da solução (apresentação)

---

## 📁 Arquivos deste repositório

| Arquivo | Descrição |
|---|---|
| `senai_bank_aula_sqlite.db` | Banco SQLite exportado, já populado com clientes, contas e movimentações |
| `README.md` | Este documento |

<div align="center">

---

Projeto desenvolvido para fins educacionais — **SENAI**

</div>
