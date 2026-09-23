# Status do projeto — Chaveiro Abençoado (frontend)

> Arquivo de acompanhamento local. Atualizado a cada mudança relevante.

## Visão geral

Frontend responsivo do Sistema Chaveiro Abençoado, pensado para celular e balcão no computador. Conecta ao backend Spring Boot via API REST + JWT.

## Stack

- React 18 / Vite 5
- Tailwind CSS 3
- Axios (com interceptor JWT)
- React Router DOM 6
- Lucide React (ícones)

## Identidade visual atual

- Paleta: marinho (#0B1A2E) + ouro (#F5B731)
- Fontes: Barlow Condensed (display), DM Sans (body), IBM Plex Mono (números)
- Conceito: balcão de trabalho, com catálogo, ficha de atendimento e conferência do caixa
- Layout mobile com navegação inferior e desktop com navegação lateral a partir de 1024 px
- Elemento de assinatura: chave do dia, formada pelos serviços registrados
- Logo: public/logo.png (mascote chaveiro + nome)

## Estrutura

```
src/
├── App.jsx                    # Rotas + AppLayout
├── main.jsx                   # Entry point (BrowserRouter + AuthProvider)
├── index.css                  # Tailwind + globals
├── services/
│   └── api.js                 # Axios instance + JWT interceptor
├── contexts/
│   └── AuthContext.jsx        # Login, logout, isDono, localStorage
├── components/
│   ├── BottomNav.jsx          # Nav inferior 4 abas
│   ├── PageHeader.jsx         # Cabeçalho responsivo compartilhado
│   ├── InterfaceState.jsx     # Estados de carregamento e erro
│   ├── Card.jsx               # Card reutilizável
│   ├── Chip.jsx               # Filtro/seleção
│   ├── GoldButton.jsx         # CTA primário
│   ├── InstallPrompt.jsx      # Banner PWA "Instalar app"
│   ├── KeyCounter.jsx         # Contador de chaves (central)
│   ├── ProtectedRoute.jsx     # Guard com role (apenaDono)
│   └── TeethLine.jsx          # Divisor SVG decorativo
└── pages/
    ├── Login.jsx              # Login com logo
    ├── Home.jsx               # POS home (saudação, counter, grid, feed)
    ├── Precos.jsx             # Tabela de preços com filtros
    ├── RegistrarServico.jsx   # Registro rápido de serviço
    ├── Caixa.jsx              # Caixa do dia
    ├── Fechamento.jsx         # Resumo fechamento
    ├── Relatorios.jsx         # Gráficos (DONO only)
    └── Menu.jsx               # Perfil, cadastro, config
```

## Redesign — 23/09/2026

### Etapa 1 — base responsiva

- Removido o limite global `max-w-md`; páginas usam `page-shell` e conteúdo de até 1200 px.
- Navegação inferior mantém os quatro rótulos visíveis no celular.
- Navegação lateral com marca e ação “Registrar serviço” no desktop.
- Foco de teclado padronizado e respeitado em botões, links e campos.
- Criados formatadores compartilhados de moeda/data e estados reutilizáveis de carregamento/erro.
- Decisão: manter a paleta marinho + ouro e reduzir caixas decorativas, usando hierarquia, listas e divisores.

### Etapa 2 — catálogo e ficha de atendimento

- Tabela de serviços virou um catálogo pesquisável em linhas, com filtros incluindo `OUTROS`.
- Preços de balcão e externo aparecem em colunas comparáveis e sempre com centavos.
- Selecionar uma linha abre o registro com o serviço preenchido.
- Registro usa duas colunas no desktop e fluxo progressivo no celular: escolher serviço e preencher a ficha.
- O atendimento externo informa que substitui o valor pelo preço externo cadastrado; endereço é obrigatório quando ativado.
- Adicionados busca vazia, erro com nova tentativa, bloqueio de envio duplicado e rótulos acessíveis.

### Etapa 3 — Home do balcão

- A Home prioriza o movimento do dia, com identificação discreta da loja e do usuário.
- Produção e últimos atendimentos ficam lado a lado no desktop.
- A chave do dia continua como assinatura visual e agora explica que cada dente representa um dos últimos 24 serviços e sua altura acompanha o valor.
- Quantidade de chaves foi separada visual e textualmente da quantidade de serviços.
- Valores usam moeda brasileira com centavos; erro de API não aparece mais como dados zerados.

### Etapa 4 — caixa e fechamento

- Caixa organiza abertura, entradas, saídas e saldo como uma conferência única.
- Abertura e movimentação têm formulários integrados, estados de envio e mensagens de erro.
- Fechamento exige confirmação explícita dentro da interface, sem `confirm()` do navegador.
- Resumo de fechamento usa linguagem visual de comprovante e identifica quando os dados ainda são parciais.
- Falha de consulta, caixa não aberto, caixa aberto e caixa fechado são estados distintos.

### Etapa 5 — relatórios, administração e acesso

- Relatórios usam barras horizontais proporcionais para comparar pagamentos e despesas.
- Removido o Recharts: a curva entre categorias não representava uma série temporal e a dependência deixou de ser necessária.
- Menu separa operação, administração e conta; o perfil usa a inicial do usuário em vez de emoji.
- Cadastro de funcionário ganhou campos rotulados, validação mínima de senha e bloqueio de envio duplicado.
- Login usa “Acesso da equipe”, identidade direta da loja e composição própria para desktop.
- O bundle principal caiu de aproximadamente 645 kB para 271 kB após remover a biblioteca de gráficos.

### Validação do redesign

- `npm run build` aprovado após cada etapa; bundle final sem aviso de chunk acima de 500 kB.
- Login inspecionado em 360, 390, 768 e desktop sem rolagem horizontal.
- Zoom do navegador voltou a ser permitido no celular, removendo `user-scalable=no`.
- Telas autenticadas dependem de backend e sessão válidos para inspeção visual com dados reais.

## Configuração

- `vite.config.js`: proxy /api → localhost:8080
- `tailwind.config.js`: cores (marinho, ouro, sucesso, erro, texto), fontes (display, body, numero)
- `.claude/launch.json`: dev server config

## Rotas

| Rota | Página | Acesso |
|---|---|---|
| /login | Login | Público |
| / | Home | Autenticado |
| /servicos | Preços | Autenticado |
| /servicos/registrar | Registrar Serviço | Autenticado |
| /caixa | Caixa | Autenticado |
| /fechamento | Fechamento | Autenticado |
| /relatorios | Relatórios | DONO |
| /menu | Menu | Autenticado |

## Commits

| Commit | Mensagem |
|---|---|
| `610f052` | Initial commit |
| `e779703` | feat: frontend MVP completo |
| `5492128` | feat: logo atualizada nas telas |
| `3f377c2` | feat: PWA instalavel no celular |

## PWA — 24/08/2026

- `public/manifest.json` — nome, cores, ícones, display standalone
- `public/sw.js` — service worker com cache (assets estáticos + API com NetworkFirst)
- Ícones: pwa-64x64, pwa-192x192, pwa-512x512, pwa-maskable-512x512, apple-touch-icon, favicon-32x32
- `src/components/InstallPrompt.jsx` — banner de instalação (captura `beforeinstallprompt`)
- `scripts/generate-icons.mjs` — gera ícones a partir do logo.png via sharp

## Deploy

- **Vercel**: conecta no GitHub, detecta Vite automaticamente
- Build: `npm run build` → output: `dist`
- Variável: `VITE_API_URL` = URL do backend no Render (ex: `https://chaveiro-back.onrender.com`)
- O `api.js` usa `VITE_API_URL` quando disponível, senão faz proxy local (`/api`)

## Status

MVP funcional completo + PWA. Testado end-to-end com backend + PostgreSQL.
Todas as 7 telas funcionando com dados reais da API.
Pronto para deploy (Vercel).

### Próxima fase

Redesign da identidade visual (planejado pelo Claudio).
Dashboard com gráficos, exportação PDF, relatórios avançados.
