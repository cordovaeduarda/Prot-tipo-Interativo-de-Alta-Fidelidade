# Protótipo Interativo de Alta Fidelidade

O protótipo interativo de alta fidelidade pode ser visualizado no seguinte link: https://cordovaeduarda.github.io/Prot-tipo-Interativo-de-Alta-Fidelidade/abc_prototipo/

## Acessibilidade (WCAG 2.2)

O protótipo segue as diretrizes da [WCAG 2.2 (versão em português brasileiro)](https://www.w3.org/Translations/WCAG22-pt-BR-20250327/). Foram adicionados os seguintes elementos de acessibilidade:

### Perceptível

- **Textos alternativos e rótulos** — todos os ícones decorativos (emojis) marcados com `aria-hidden="true"`; ícones informativos com `aria-label` descritivo.
- **Estrutura semântica** — uso de `<main>`, `<header>`, `<nav>`, `<section>`, `<form>`, `<dl>/<dt>/<dd>` e cabeçalhos hierárquicos (`<h1>`, `<h2>`) para que leitores de tela compreendam a estrutura da página.
- **Tabela de disciplinas** — `<caption>` (oculto visualmente) descreve o conteúdo e a página atual; cabeçalhos com `scope="col"`.
- **Listas semânticas** — cards de disciplina em `<ul>/<li>`; resumo de pagamento e detalhes da matrícula em `<dl>`.

### Operável

- **Skip link** — link "Pular para o conteúdo principal" que aparece ao primeiro `Tab`, permitindo ignorar o cabeçalho repetitivo (WCAG 2.4.1 Bypass Blocks).
- **Navegação por teclado completa** — todos os elementos interativos podem ser acessados e ativados via teclado (`Tab`, `Shift+Tab`, `Enter`, `Espaço`).
- **Linhas de disciplina e métodos de pagamento** — implementados com `role="checkbox"` / `role="radio"`, `aria-checked`, `tabindex="0"` e handlers para `Espaço`/`Enter`.
- **Indicador de foco visível** — contorno azul de 3px (`:focus-visible`) ao redor de qualquer elemento focado pelo teclado (WCAG 2.4.7 Focus Visible / 2.4.11 Focus Not Obscured).
- **Botões de paginação reais** — substituídos `<span>` por `<button>` com `aria-label` e `aria-current="page"` na página ativa.
- **Modal acessível** — foco move automaticamente para dentro do modal ao abrir; tecla `Esc` fecha; foco retorna ao elemento que abriu o modal ao fechar.
- **Animações respeitam preferências do usuário** — `@media (prefers-reduced-motion: reduce)` desativa animações para usuários sensíveis a movimento (WCAG 2.3.3 Animation from Interactions).

### Compreensível

- **Rótulos e instruções claros** — todo `<input>` e `<select>` tem `<label for="...">` associado, `aria-required="true"` em campos obrigatórios e `aria-describedby` ligando à mensagem de erro e a dicas de formato.
- **Formato de campo informado** — `inputmode="numeric"`, `type="email"`, `type="tel"`, `autocomplete="name|bday|email|tel"` para preenchimento automático e teclados apropriados (WCAG 1.3.5 Identify Input Purpose).
- **Mensagens de erro programáticas** — cada erro tem `role="alert"`, é vinculado ao campo via `aria-describedby` e marca `aria-invalid="true"` no campo.
- **Foco move para o primeiro campo inválido** — quando a validação falha, o foco vai automaticamente para o campo que precisa ser corrigido.
- **Stepper como navegação semântica** — `<nav aria-label="Progresso da matrícula">` com `aria-current="step"` no passo atual e texto oculto "passo N de 4, status".

### Robusto

- **Anúncios por leitor de tela** — região live `#sr-announcer` (`role="status"`, `aria-live="polite"`) anuncia: mudança de tela, troca de visualização, abertura/fechamento de modal, erros de validação e estado de carregamento.
- **Toasts acessíveis** — `role="status"` + `aria-live="polite"` + `aria-atomic="true"` para que notificações sejam lidas pelos leitores de tela.
- **Estado de carregamento anunciado** — botões em loading recebem `aria-busy="true"`.
- **`aria-modal`, `aria-hidden` e `aria-labelledby`** corretamente aplicados ao diálogo do boleto.

### Resumo dos novos atributos/comportamentos

| Categoria | Implementação |
|-----------|---------------|
| Skip link | `.skip-link` visível apenas ao receber foco |
| SR-only | Classe `.sr-only` para texto invisível mas anunciado |
| Foco | `:focus-visible` global + foco automático em headings (`#screen-heading`) ao trocar de tela |
| Live regions | `#toast` (notificações) + `#sr-announcer` (mudanças de estado) |
| ARIA roles | `dialog`, `tablist`/`tab`, `radiogroup`/`radio`, `checkbox`, `status`, `alert`, `search`, `banner` |
| ARIA states | `aria-required`, `aria-invalid`, `aria-checked`, `aria-pressed`/`aria-selected`, `aria-current`, `aria-busy`, `aria-disabled`, `aria-hidden` |
| ARIA relationships | `aria-labelledby`, `aria-describedby`, `aria-controls` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` |
