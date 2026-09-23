# 🔑 Chaveiro Abençoado — Frontend

<div align="center">

![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite%205-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS%203-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Instalável-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

![Status](https://img.shields.io/badge/Status-🚀%20MVP%20Completo-0B1A2E?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietária-red?style=for-the-badge)

**Sistema mobile-first de gestão para chaveiros: serviços, caixa do dia e relatórios, no bolso do dono e do funcionário.**

</div>

---

## 📖 Sobre o Projeto

O **Chaveiro Abençoado** é o frontend de um sistema de gestão pensado para o dia a dia real de um chaveiro: cada toque na tela precisa registrar algo útil. O funcionário não quer preencher formulário — quer bater o olho no preço, registrar o serviço e seguir pro próximo cliente.

Layout responsivo para celular e computador, com dois perfis de acesso: **DONO** (acesso total, incluindo relatórios) e **FUNCIONÁRIO** (operação do dia a dia). Consome a API REST do backend Spring Boot (`chaveiro-back`) via Axios com autenticação JWT.

> **Fase Atual:** MVP funcional completo com identidade de balcão, telas responsivas, dados reais da API e instalação como PWA.

---

## ✨ Funcionalidades

- 🔐 **Login com JWT** — sessão persistida em `localStorage`, logout automático em token expirado/inválido (401)
- 🏠 **Home (POS)** — movimento do dia, chave visual dos últimos serviços, contador de chaves cortadas, situação do caixa e atendimentos recentes
- 💵 **Tabela de preços** — catálogo pesquisável e filtrável, com preço de balcão e atendimento externo
- ➕ **Registrar serviço** — busca do tipo, quantidade, forma de pagamento (Dinheiro/PIX/Débito/Crédito), toggle de atendimento a domicílio com endereço e cálculo automático do total
- 💰 **Caixa do dia** — abertura de caixa com valor inicial, registro de movimentações (entrada/saída) por categoria, saldo em tempo real
- 📊 **Fechamento diário** — resumo de abertura, entradas, saídas, saldo final e total de chaves cortadas no dia
- 📈 **Relatórios (DONO)** — comparações por barras de entradas por pagamento e saídas por categoria nos períodos diário, semanal e mensal
- ⚙️ **Menu** — dados do perfil logado, cadastro de novos funcionários (restrito a DONO) e logout
- 🛡️ **Rotas protegidas** — `ProtectedRoute` bloqueia telas restritas (Relatórios) para quem não é DONO
- 📱 **PWA instalável** — manifest, service worker (cache de assets + estratégia NetworkFirst na API) e banner de instalação no celular

---

## 🏗️ Estrutura do Projeto

```
chaveiro-front/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx       🧭 Navegação inferior e lateral
│   │   ├── Card.jsx            🃏 Card reutilizável
│   │   ├── Chip.jsx            🔘 Filtro/seleção
│   │   ├── GoldButton.jsx      🟡 CTA primário
│   │   ├── InstallPrompt.jsx   📲 Banner de instalação PWA
│   │   ├── ChaveDoDia.jsx      🔑 Perfil visual dos serviços do dia
│   │   ├── InterfaceState.jsx  ⏳ Estados de carregamento e erro
│   │   ├── PageHeader.jsx      📐 Cabeçalho compartilhado
│   │   ├── ProtectedRoute.jsx  🛡️ Guard de rota por role
│   ├── contexts/
│   │   └── AuthContext.jsx     🔐 Login, logout, isDono, sessão
│   ├── pages/
│   │   ├── Login.jsx           Autenticação
│   │   ├── Home.jsx            POS — saudação, contador, atalhos, feed
│   │   ├── Precos.jsx          Tabela de preços por categoria
│   │   ├── RegistrarServico.jsx Registro rápido de serviço
│   │   ├── Caixa.jsx           Abertura e movimentações do caixa
│   │   ├── Fechamento.jsx      Resumo do fechamento diário
│   │   ├── Relatorios.jsx      Comparativos (acesso DONO)
│   │   └── Menu.jsx            Perfil, cadastro de funcionário, logout
│   ├── services/
│   │   └── api.js              Instância Axios + interceptors JWT
│   ├── utils/
│   │   └── formatters.js       Moeda e datas em pt-BR
│   ├── App.jsx                 Rotas + AppLayout
│   ├── main.jsx                Entry point (BrowserRouter + AuthProvider)
│   └── index.css                Tailwind + globals
├── public/
│   ├── logo.png
│   ├── manifest.json            Configuração PWA
│   └── sw.js                    Service worker (cache + NetworkFirst)
├── scripts/
│   └── generate-icons.mjs      Gera ícones PWA a partir do logo (sharp)
├── vite.config.js               Proxy /api → localhost:8080 em dev
└── tailwind.config.js           Paleta e fontes customizadas
```

---

## 🗺️ Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/` | Home | Autenticado |
| `/servicos` | Tabela de Preços | Autenticado |
| `/servicos/registrar` | Registrar Serviço | Autenticado |
| `/caixa` | Caixa do Dia | Autenticado |
| `/fechamento` | Fechamento | Autenticado |
| `/relatorios` | Relatórios | DONO |
| `/menu` | Menu | Autenticado |

---

## 🎨 Identidade Visual

| Papel | Cor | Hex |
|---|---|---|
| Marinho (fundo) | 🔵 | `#0B1A2E` |
| Marinho claro/borda | 🔷 | `#14253D` / `#1E3A5F` |
| Ouro (destaque/CTA) | 🟡 | `#F5B731` |
| Sucesso | 🟢 | `#22C55E` |
| Erro | 🔴 | `#EF4444` |

**Fontes:** Barlow Condensed (display) · DM Sans (corpo) · Space Grotesk (números/valores)

> **Obs:** identidade visual atual é a base funcional do MVP — redesign planejado como próxima fase.

---

## 🚀 Tecnologias

<div align="center">

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 18.3 | Componentização e UI |
| **Vite** | 5.4 | Build e dev server |
| **Tailwind CSS** | 3.4 | Estilização utilitária |
| **React Router DOM** | 6.30 | Roteamento e proteção de rotas |
| **Axios** | 1.19 | Consumo da API + interceptors JWT |
| **Recharts** | 3.10 | Gráficos dos relatórios |
| **Lucide React** | Ícones | Ícones da interface |

</div>

---

## 💻 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Backend [`chaveiro-back`](https://github.com/claudiondev/chaveiro-back) rodando em `http://localhost:8080` (o Vite já faz proxy de `/api` para lá em desenvolvimento)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/claudiondev/chaveiro-front.git
cd chaveiro-front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

### Build de produção

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve o build localmente
```

---

## 📱 PWA — Instalável no celular

O app pode ser instalado como aplicativo no Android/iOS direto pelo navegador:

- `public/manifest.json` — nome, cores do tema, ícones e modo `standalone`
- `public/sw.js` — service worker com cache de assets estáticos e estratégia NetworkFirst para chamadas à API
- `InstallPrompt.jsx` — banner de instalação, captura o evento `beforeinstallprompt`
- `scripts/generate-icons.mjs` — gera todos os tamanhos de ícone a partir de `logo.png` via `sharp`

---

## ☁️ Deploy

- **Frontend:** Vercel — conecta direto no repositório GitHub e detecta o Vite automaticamente. Build: `npm run build` → output `dist`
- **Variável de ambiente:** `VITE_API_URL` — URL do backend em produção (ex.: `https://chaveiro-back.onrender.com`). Se não definida, `api.js` cai no proxy local (`/api`)
- **Backend:** Render, com PostgreSQL — ver [`chaveiro-back`](https://github.com/claudiondev/chaveiro-back)

---

## 📋 Checklist de Desenvolvimento

### ✅ Fase 1 — MVP
- ✅ Setup do projeto (Vite + React + Tailwind)
- ✅ Autenticação JWT (login, contexto, rotas protegidas)
- ✅ Home / POS com contador de chaves e atalhos
- ✅ Tabela de preços com filtro por categoria
- ✅ Registro de serviço (quantidade, pagamento, domicílio)
- ✅ Caixa do dia (abertura + movimentações)
- ✅ Fechamento diário
- ✅ Relatórios comparativos (DONO)
- ✅ Menu (perfil, cadastro de funcionário, logout)
- ✅ PWA instalável (manifest, service worker, ícones)
- ✅ Configuração de produção (`VITE_API_URL` dinâmica)

### ✅ Fase 2 — Identidade de balcão
- ✅ Redesign completo e responsivo

### ⏳ Próximos passos
- ⏳ Dashboard com gráficos avançados
- ⏳ Exportação de relatórios em PDF
- ⏳ Deploy em produção (Vercel + Render)

---

## 🔗 Backend

O backend do Chaveiro Abençoado é desenvolvido em **Java 17 + Spring Boot** com autenticação JWT, Spring Data JPA e PostgreSQL.

📦 Repositório: [chaveiro-back](https://github.com/claudiondev/chaveiro-back)

---

## 👨‍💻 Autor

**Claudio Nascimento**

- 🔗 GitHub: [@claudiondev](https://github.com/claudiondev)
- 📧 Email: claudioncruz152@gmail.com

---

## 📄 Licença

**LICENÇA PROPRIETÁRIA - VISUALIZAÇÃO APENAS**

Este código é um **projeto de portfólio** protegido por direitos autorais.

### ✅ Permitido:
- 👀 Visualizar e estudar o código
- 💼 Usar como referência em entrevistas
- 📚 Aprender com as implementações

### ❌ Proibido:
- 🚫 Copiar ou usar comercialmente sem autorização
- 🚫 Distribuir sem permissão do autor

```
Copyright © 2026 Claudio Nascimento. Todos os direitos reservados.
```

---

<div align="center">

**Desenvolvido por Claudio Nascimento** 🔑

</div>
