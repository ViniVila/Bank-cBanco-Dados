// ===============================================
// SENAI BANK - Tema visual
// Este arquivo concentra cores e medidas usadas no app.
// Assim, quando alteramos uma cor aqui, a mudança se reflete
// nos componentes que importam o objeto theme.
// ===============================================

export const theme = {
  colors: {
    primary: "#D71920",       // Vermelho institucional usado como cor principal.
    dark: "#111827",          // Cor escura para textos fortes e botões.
    background: "#F3F4F6",    // Fundo claro das telas internas.
    white: "#FFFFFF",         // Branco para cards e textos sobre fundos escuros.
    muted: "#6B7280",         // Cinza para textos auxiliares.
    success: "#16A34A",       // Verde para receitas e mensagens positivas.
    danger: "#DC2626",        // Vermelho para despesas e alertas.
    warning: "#F59E0B",       // Amarelo/laranja para avisos.
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 22,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
  },
};
