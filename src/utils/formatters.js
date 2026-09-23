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
