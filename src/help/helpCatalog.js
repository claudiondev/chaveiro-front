const comum = {
  versao: 1,
  dicas: [],
  etapas: [],
}

export const GUIAS_AJUDA = {
  INICIO: {
    ...comum,
    rota: '/',
    titulo: 'Movimento de hoje',
    resumo: 'Acompanhe a situação do caixa, os atendimentos e o resultado do expediente em um só lugar.',
    dicas: [
      { pergunta: 'Por que não consigo registrar um serviço?', resposta: 'O caixa precisa estar aberto. Toque no aviso de caixa para fazer a abertura.' },
      { pergunta: 'O que representa a chave?', resposta: 'Cada dente representa um dos últimos serviços. A altura acompanha o valor do atendimento.' },
    ],
    etapas: [
      { alvo: 'inicio-caixa', titulo: 'Situação do caixa', texto: 'Confira se o caixa está aberto. Quando estiver fechado, toque aqui para iniciar o expediente.' },
      { alvo: 'inicio-movimento', titulo: 'Movimento do dia', texto: 'Veja quantos serviços foram feitos e como eles formam a chave do dia.' },
      { alvo: 'inicio-resumo', titulo: 'Resumo financeiro', texto: 'Entradas, saídas e saldo são atualizados conforme o trabalho é registrado.' },
      { alvo: 'inicio-recentes', titulo: 'Últimos atendimentos', texto: 'Consulte os serviços mais recentes e abra uma linha para ver os detalhes.' },
    ],
  },
  SERVICOS: {
    ...comum,
    rota: '/servicos',
    titulo: 'Tabela de serviços',
    resumo: 'Consulte os preços e comece um atendimento com o serviço já selecionado.',
    dicas: [
      { pergunta: 'Qual preço usar fora da loja?', resposta: 'O valor com o ícone de casa é o preço do atendimento externo.' },
      { pergunta: 'Como inicio um atendimento?', resposta: 'Toque no serviço desejado ou use o botão “Novo serviço”.' },
    ],
    etapas: [
      { alvo: 'servicos-busca', titulo: 'Encontre rapidamente', texto: 'Pesquise pelo nome ou filtre a tabela por categoria.' },
      { alvo: 'servicos-lista', titulo: 'Compare os preços', texto: 'Cada linha mostra o preço de balcão e, quando cadastrado, o preço externo.' },
      { alvo: 'servicos-novo', titulo: 'Comece o atendimento', texto: 'Abra o registro vazio ou toque diretamente em um serviço da lista.' },
    ],
  },
  REGISTRAR_SERVICO: {
    ...comum,
    rota: '/servicos/registrar',
    titulo: 'Registrar serviço',
    resumo: 'Monte a ficha do atendimento, confira o total e registre o serviço no movimento do dia.',
    dicas: [
      { pergunta: 'O atendimento é em domicílio?', resposta: 'Ative a opção de domicílio para usar o preço externo e informar o endereço.' },
      { pergunta: 'Posso sair da ajuda sem perder os dados?', resposta: 'Sim. Abrir ou fechar a ajuda não limpa o formulário.' },
    ],
    etapas: [
      { alvo: 'registro-escolha', titulo: 'Escolha o serviço', texto: 'Busque na tabela e toque no serviço realizado.' },
      { alvo: 'registro-ficha', titulo: 'Preencha o atendimento', texto: 'Ajuste quantidade, pagamento, domicílio e observação quando necessário.' },
      { alvo: 'registro-total', titulo: 'Confira antes de salvar', texto: 'Revise o valor total e registre somente quando os dados estiverem corretos.' },
    ],
  },
  CAIXA: {
    ...comum,
    rota: '/caixa',
    titulo: 'Caixa do dia',
    resumo: 'Abra o expediente, acompanhe o saldo e registre entradas ou despesas que não vieram de serviços.',
    dicas: [
      { pergunta: 'Serviço precisa de entrada manual?', resposta: 'Não. Ao registrar um serviço, a entrada correspondente é criada automaticamente.' },
      { pergunta: 'Quando uso entrada avulsa?', resposta: 'Use para dinheiro que entrou sem estar ligado a um serviço registrado.' },
      { pergunta: 'Quem pode fechar o caixa?', resposta: 'Somente o dono pode confirmar o fechamento do expediente.' },
    ],
    etapas: [
      { alvo: 'caixa-abertura', titulo: 'Abra o expediente', texto: 'Informe o dinheiro disponível no começo do dia. Só pode existir um caixa por data.' },
      { alvo: 'caixa-resumo', titulo: 'Acompanhe o saldo', texto: 'O resumo separa abertura, entradas, saídas e o saldo atual.' },
      { alvo: 'caixa-movimentacoes', titulo: 'Movimentações avulsas', texto: 'Registre retiradas, despesas ou entradas que não pertencem a um serviço.' },
      { alvo: 'caixa-fechamento', titulo: 'Fechamento do dia', texto: 'O dono confere os valores e encerra o caixa quando o expediente terminar.', role: 'DONO' },
    ],
  },
  FECHAMENTO: {
    ...comum,
    rota: '/fechamento',
    titulo: 'Fechamento',
    resumo: 'Confira o resultado do expediente e consulte comprovantes anteriores.',
    dicas: [
      { pergunta: 'Onde encontro um dia anterior?', resposta: 'O dono pode abrir a aba “Histórico” e selecionar a data desejada.' },
      { pergunta: 'Como salvo o comprovante?', resposta: 'Na conferência, o dono pode usar “Baixar PDF”.' },
    ],
    etapas: [
      { alvo: 'fechamento-abas', titulo: 'Hoje ou histórico', texto: 'Alterne entre a conferência atual e os fechamentos anteriores.', role: 'DONO' },
      { alvo: 'fechamento-conteudo', titulo: 'Conferência do expediente', texto: 'Revise abertura, entradas, saídas, serviços, chaves e saldo final.' },
      { alvo: 'fechamento-pdf', titulo: 'Comprovante em PDF', texto: 'O dono pode baixar ou compartilhar o fechamento exibido.', role: 'DONO' },
    ],
  },
  RELATORIOS: {
    ...comum,
    rota: '/relatorios',
    role: 'DONO',
    titulo: 'Relatórios',
    resumo: 'Analise o movimento por dia, semana ou mês, com detalhes financeiros e operacionais.',
    dicas: [
      { pergunta: 'O faturamento inclui fiado?', resposta: 'Sim. O faturamento considera os serviços realizados; garantias não entram.' },
      { pergunta: 'Como voltar ao período atual?', resposta: 'Use “Voltar para o atual” depois de consultar uma data anterior.' },
    ],
    etapas: [
      { alvo: 'relatorios-periodo', titulo: 'Escolha o período', texto: 'Alterne entre dia, semana e mês e navegue pelas datas com as setas.' },
      { alvo: 'relatorios-indicadores', titulo: 'Indicadores principais', texto: 'Compare entradas, saídas, resultado, serviços e chaves do período.' },
      { alvo: 'relatorios-detalhes', titulo: 'Entenda o movimento', texto: 'Veja pagamentos, despesas, dias, serviços mais vendidos e desempenho da equipe.' },
    ],
  },
  MENU: {
    ...comum,
    rota: '/menu',
    titulo: 'Mais opções',
    resumo: 'Acesse rotinas da operação, dados da conta e recursos administrativos do seu perfil.',
    dicas: [
      { pergunta: 'Por que algumas opções não aparecem?', resposta: 'Relatórios, cadastro de funcionários e histórico completo são recursos exclusivos do dono.' },
      { pergunta: 'Como sair com segurança?', resposta: 'Use “Sair da conta” ao terminar, principalmente em aparelhos compartilhados.' },
    ],
    etapas: [
      { alvo: 'menu-perfil', titulo: 'Sua conta', texto: 'Confira qual usuário está conectado e o perfil de acesso atual.' },
      { alvo: 'menu-operacao', titulo: 'Rotinas da operação', texto: 'Abra a tabela de serviços e, para o dono, a conferência do fechamento.' },
      { alvo: 'menu-administracao', titulo: 'Administração', texto: 'O dono encontra relatórios e cadastro de funcionários nesta área.', role: 'DONO' },
      { alvo: 'menu-sair', titulo: 'Encerrar o acesso', texto: 'Saia da conta ao terminar de usar um aparelho compartilhado.' },
    ],
  },
}

export function guiaDaRota(pathname, role) {
  const guias = Object.entries(GUIAS_AJUDA)
    .sort(([, a], [, b]) => b.rota.length - a.rota.length)
  const encontrado = guias.find(([, guia]) => {
    const corresponde = guia.rota === '/' ? pathname === '/' : pathname.startsWith(guia.rota)
    return corresponde && (!guia.role || guia.role === role)
  })
  return encontrado ? { id: encontrado[0], ...encontrado[1] } : null
}
