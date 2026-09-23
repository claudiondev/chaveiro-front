# Histórico de fechamentos — desenho aprovado

## Objetivo

Dar ao dono uma leitura completa do movimento de cada dia. O fechamento deve continuar mostrando os valores do caixa e passar a explicar quais serviços formaram aquele resultado, inclusive carimbos, aberturas e outros trabalhos que não entram em “chaves cortadas”.

## Experiência

A rota `/fechamento` terá duas abas exclusivas para o dono:

- **Hoje:** mantém o comprovante atual, identificado como parcial quando o caixa estiver aberto.
- **Histórico:** lista os fechamentos do mais recente para o mais antigo, dez por vez. “Ver mais” acrescenta a próxima página sem remover os itens já carregados.

Cada linha do histórico mostra data, total de serviços, total de chaves e saldo final. Ao selecionar uma linha, o comprovante daquele dia é aberto. Em telas a partir de 1024 px, lista e comprovante ficam lado a lado; no celular, o comprovante aparece abaixo da lista.

O comprovante terá um bloco “Serviços realizados”, agrupado pelo nome cadastrado. Cada linha mostra nome, soma das quantidades e soma dos valores. “Chaves cortadas” permanece como informação complementar, enquanto “Serviços” representa todos os atendimentos registrados.

## API e segurança

O backend terá `GET /api/caixa/historico/lista?page=0&size=10`, ordenado por data e id em ordem decrescente. A resposta será paginada e reutilizará os campos de `FechamentoResponse`.

O endpoint será restrito à função `DONO`, terá tamanho de página limitado no servidor e não alterará o endpoint existente `GET /api/caixa/historico?data=AAAA-MM-DD`.

Ao abrir um fechamento, o frontend consulta em paralelo:

- `/caixa/historico?data=AAAA-MM-DD` para os totais consolidados;
- `/servicos?data=AAAA-MM-DD` para formar o detalhamento por nome.

Nenhum total financeiro será recalculado no navegador. O frontend apenas agrupa os serviços retornados para apresentação.

## Estados e validação

- Carregamento inicial, carregamento de mais itens, histórico vazio e falha de consulta terão mensagens distintas.
- Um erro ao abrir o detalhe não apaga a lista já carregada e oferece nova tentativa.
- Cliques repetidos durante carregamento serão bloqueados.
- O dia atual e dias anteriores continuarão distinguindo fechamento parcial e fechado.
- O backend validará paginação e terá teste do serviço para ordenação e conteúdo da página.
- O frontend será validado com build e inspeção em desktop e celular.

## Entrega

Backend e frontend serão registrados em commits separados. As decisões e os novos contratos serão acrescentados aos respectivos `CLAUDE.md`.
