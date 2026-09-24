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
- Fontes: Barlow Condensed somente em títulos; DM Sans em textos, valores, horários e quantidades
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
    ├── Fechamento.jsx         # Abas Hoje/Histórico + comprovante
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

### Home — observações dos atendimentos

- Atendimentos recentes com `observacao` exibem o indicador “tem observação” e uma seta.
- O clique expande a observação abaixo da própria linha; um novo clique recolhe o conteúdo.
- Apenas uma observação permanece aberta por vez.
- Linhas sem observação continuam apenas informativas e não sugerem interação.

### Tipografia numérica

- Removida a IBM Plex Mono de toda a interface e do carregamento do Google Fonts.
- Valores, horários, quantidades e o contador principal usam DM Sans.
- Barlow Condensed permanece reservada aos títulos e rótulos de identidade.

### PWA e cache no desenvolvimento

- O service worker deixou de ser registrado no modo de desenvolvimento.
- Ao abrir o projeto no Vite, registros e caches antigos são removidos automaticamente.
- Navegações da PWA usam rede primeiro e recorrem ao cache apenas quando estiver offline.
- Cache atualizado para `chaveiro-v2`, evitando que versões antigas escondam mudanças visuais.

### Chave do dia — detalhes por dente

- Cada dente pode ser explorado por mouse, toque ou teclado.
- O destaque revela nome do serviço, horário, quantidade e valor no próprio desenho.
- A área de interação é maior que o dente visível para facilitar o toque no celular.
- O tooltip permanece contido no desenho mesmo nos primeiros e últimos dentes.

### Home — contador de serviços

- O indicador principal passou de “chaves cortadas” para “serviços feitos”.
- O total usa a mesma lista diária que forma os dentes e alimenta os últimos atendimentos.
- Cada registro conta como um serviço, independentemente da quantidade de unidades informada.
- O texto explicativo da chave foi ajustado para usar a mesma medida do contador.

### Navegação lateral recolhível

- Uma seta na borda do menu alterna entre 256 px e 80 px no desktop.
- A seta gira e o conteúdo ajusta o recuo com transição de 200 ms.
- No modo recolhido, os ícones permanecem visíveis e revelam seus nomes no hover ou foco.
- A ação de registrar serviço também permanece acessível como ícone.
- A preferência é salva em `localStorage` e mantida durante a navegação.
- A navegação inferior do celular não foi alterada.

### Fechamento — histórico — 23/09/2026

- `/fechamento` tem abas **Hoje** e **Histórico**, visíveis só para o DONO (funcionário vê só o comprovante de hoje).
- Histórico carrega 10 fechamentos por vez via `GET /caixa/historico/lista?page=&size=`; “Ver mais” acrescenta a próxima página sem remover as anteriores e some na última.
- Cada linha mostra data, dia da semana, serviços, chaves e saldo final.
- Selecionar um dia abre o comprovante via `GET /caixa/historico?data=`; respostas de cliques antigos são descartadas.
- Desktop (≥1024 px): lista e comprovante lado a lado, comprovante fixo (`sticky`). Celular: comprovante abaixo da lista, com rolagem automática após carregar.
- O comprovante (compartilhado entre as abas) ganhou o bloco “Serviços realizados”: nome, quantidade somada e valor somado, já agrupados pelo backend (campo `servicos` do `FechamentoResponse`). O front não recalcula nenhum total.
- Estados próprios: carregando, erro com nova tentativa (lista preservada ao falhar o detalhe), histórico vazio, caixa não aberto hoje (404) e dia sem serviços.
- `formatters.js`: novo `dataDeISO()` converte `AAAA-MM-DD` em data local sem deslocamento de fuso.

### Relatórios detalhados — 23/09/2026

- Abas Dia / Semana / Mês com navegação entre períodos (‹ Setembro de 2026 ›); a seta de avanço trava no período atual e “Voltar para o atual” aparece fora dele. Respostas de navegações antigas são descartadas.
- Parâmetros: diário `?data=`, semanal `?inicio=` (semana seg–dom), mensal `?mes=&ano=`.
- Indicadores: Faturamento, Saídas, Resultado, Serviços (com garantias), Chaves, Fiado a receber.
- “Faturamento por dia” (semana e mês): barras em CSS, dia atual destacado, dias futuros apagados, melhor dia no cabeçalho, `title`/`aria-label` por barra. Recharts não é usado (não está instalado).
- Entradas por pagamento com percentual (soma fecha com o faturamento; `AVULSA` = entrada avulsa) e saídas por categoria.
- Serviços mais vendidos (top 5 + “Ver todos”) e tabela por funcionário (serviços, chaves, faturamento, comissão estimada quando há percentual).
- Estados: carregando, erro com nova tentativa, período sem movimento.
- Seções da grade usam `min-w-0` para a tabela não alargar a coluna no celular.

### PDF do fechamento — 23/09/2026

- Botão “Baixar PDF” abaixo do comprovante (abas Hoje e Histórico), só para o DONO.
- Busca `GET /caixa/historico/pdf?data=` com `responseType: 'blob'`.
- Celular (`pointer: coarse` + `navigator.canShare`): abre o compartilhamento do aparelho (WhatsApp etc.); cancelar não é erro. Computador: download `fechamento-AAAA-MM-DD.pdf`.
- Estados: “Gerando PDF…” (bloqueia clique repetido) e mensagem de erro com nova tentativa.

### Correções pré-deploy — plano do Codex + Claude (24/09/2026)

Revisão cruzada (Codex fez o review, Claude complementou) resultou num plano de 12 tasks antes do deploy. Cada task tem commit próprio; ver `CLAUDE.md` do back para o plano completo e as tasks só de backend.

**Task 3 — `fix: remove dados privados do cache`**
- `sw.js` guardava todo `GET` autenticado da API (`/api/auth/usuarios`, `/api/servicos`, `/api/ajuda/progressos` etc.) no Cache Storage, e o logout não limpava esse cache. Num aparelho compartilhado, uma falha de rede podia servir dados administrativos de uma sessão anterior pra outra pessoa.
- Cache agora é só do app shell (os `STATIC_ASSETS`); `/api/**` nunca é lido nem escrito no cache, o handler de `fetch` simplesmente deixa passar (sem `respondWith`), inclusive para o backend em outra origem (`VITE_API_URL` em produção — o `pathname` continua `/api/...` mesmo numa URL absoluta de outro domínio).
- `CACHE_NAME` subiu pra `chaveiro-v3`: a ativação do novo Service Worker apaga qualquer cache com outro nome, inclusive o `chaveiro-v2` que já tivesse dados guardados de antes desta correção.
- `src/utils/sessao.js` (`encerrarSessaoLocal`): usada no `logout()` do `AuthContext` e no interceptor 401 do `api.js`. Além de limpar o `localStorage`, apaga todo o Cache Storage — defesa extra pro caso do Service Worker ativo no aparelho ainda ser uma versão anterior a esta correção.
- **Verificado com o `sw.js` antigo de verdade**, servindo um build de produção (`vite preview`, sem o proxy do `vite dev`): logou como dono, chamou `GET /api/auth/usuarios` e confirmei a resposta gravada em `chaveiro-v2`. Troquei pro `sw.js` novo, recarreguei (ciclo real de update do Service Worker, sem `unregister` manual) e confirmei `chaveiro-v2` apagado e nenhuma chamada nova entrando no `chaveiro-v3`.

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
| /fechamento | Fechamento (Histórico só DONO) | Autenticado |
| /relatorios | Relatórios (períodos navegáveis) | DONO |
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
