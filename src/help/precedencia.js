// Mesma regra do backend (AjudaService.naoDevePrevalecer, invertida): versão mais nova
// sempre vence; na mesma versão, uma dispensa não apaga uma conclusão já registrada.
export function devePrevalecer(atual, candidato) {
  if (!atual) return true
  if (candidato.versao > atual.versao) return true
  if (candidato.versao < atual.versao) return false
  return !(atual.status === 'CONCLUIDO' && candidato.status === 'DISPENSADO')
}
