const memoria = new Map()

// Alguns navegadores bloqueiam o localStorage ou lançam erro quando a cota acaba. O
// fallback mantém a sessão atual funcional; apenas a persistência entre recargas é perdida.
export function lerTexto(chave) {
  try {
    const valor = localStorage.getItem(chave)
    return valor ?? memoria.get(chave) ?? null
  } catch {
    return memoria.get(chave) ?? null
  }
}

export function escreverTexto(chave, valor) {
  memoria.set(chave, valor)
  try {
    localStorage.setItem(chave, valor)
    return true
  } catch {
    return false
  }
}

export function lerJson(chave, valorPadrao) {
  const bruto = lerTexto(chave)
  if (!bruto) return valorPadrao
  try {
    return JSON.parse(bruto)
  } catch {
    return valorPadrao
  }
}

export function escreverJson(chave, valor) {
  try {
    return escreverTexto(chave, JSON.stringify(valor))
  } catch {
    return false
  }
}

export function remover(chave) {
  memoria.delete(chave)
  try {
    localStorage.removeItem(chave)
  } catch {
    // nada a fazer
  }
}
