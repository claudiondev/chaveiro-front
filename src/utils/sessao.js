// Encerra a sessão local: remove o token e limpa qualquer cache do Service Worker.
// Defesa extra além do sw.js (que já não guarda respostas da API): num aparelho
// compartilhado, garante que nada de uma sessão anterior sobre disponível mesmo
// que o Service Worker ativo no aparelho ainda seja uma versão antiga.
export function encerrarSessaoLocal() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')

  if (typeof caches !== 'undefined') {
    caches.keys()
      .then((nomes) => Promise.all(nomes.map((nome) => caches.delete(nome))))
      .catch(() => {})
  }
}
