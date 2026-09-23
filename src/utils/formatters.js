export function formatarMoeda(valor = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0)
}

export function dataLocalISO(data = new Date()) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0'),
  ].join('-')
}

export function formatarData(data = new Date(), opcoes = {}) {
  return data.toLocaleDateString('pt-BR', opcoes)
}

// Converte 'AAAA-MM-DD' em Date local, sem deslocamento de fuso
export function dataDeISO(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}
