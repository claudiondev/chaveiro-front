# Status do projeto — Chaveiro Abençoado (frontend)

> Arquivo de acompanhamento local. Atualizado a cada mudança relevante.

## Visão geral

Frontend mobile-first do Sistema Chaveiro Abençoado. Conecta ao backend Spring Boot via API REST + JWT.

## Stack

- React 18 / Vite 5
- Tailwind CSS 3
- Axios (com interceptor JWT)
- React Router DOM 6
- Recharts 3
- Lucide React (ícones)

## Identidade visual atual

- Paleta: marinho (#0B1A2E) + ouro (#F5B731)
- Fontes: Barlow Condensed (display), DM Sans (body), Space Grotesk (números)
- Layout POS mobile-first, max-w-md centralizado
- Elemento central: contador de chaves cortadas
- Divisor decorativo: teeth-line (dentes de chave)
- Logo: public/logo.png (mascote chaveiro + nome)

**Obs**: identidade visual será redesenhada. O código atual serve como base funcional.

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
│   ├── Card.jsx               # Card reutilizável
│   ├── Chip.jsx               # Filtro/seleção
│   ├── GoldButton.jsx         # CTA primário
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

## Commits — 13/08/2026

| Commit | Mensagem |
|---|---|
| `e779703` | feat: frontend MVP completo |
| `610f052` | Initial commit |

## Status

MVP funcional completo. Testado end-to-end com backend + PostgreSQL.
Todas as 7 telas funcionando com dados reais da API.

### Próxima fase

Redesign da identidade visual (planejado pelo Claudio).
