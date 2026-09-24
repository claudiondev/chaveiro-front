import assert from 'node:assert/strict'
import test from 'node:test'
import { escreverJson, escreverTexto, lerJson, lerTexto, remover } from './armazenamentoSeguro.js'

test('usa o localStorage quando ele está disponível', () => {
  const dados = new Map()
  globalThis.localStorage = {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    removeItem: (chave) => dados.delete(chave),
  }

  escreverJson('usuario', { email: 'dono@loja.com' })

  assert.deepEqual(lerJson('usuario', null), { email: 'dono@loja.com' })
  remover('usuario')
  assert.equal(lerTexto('usuario'), null)
})

test('mantém os dados em memória quando o localStorage lança erro', () => {
  globalThis.localStorage = {
    getItem: () => { throw new Error('bloqueado') },
    setItem: () => { throw new Error('bloqueado') },
    removeItem: () => { throw new Error('bloqueado') },
  }

  assert.equal(escreverTexto('token', 'jwt-em-memoria'), false)
  assert.equal(lerTexto('token'), 'jwt-em-memoria')
  remover('token')
  assert.equal(lerTexto('token'), null)
})

test('ignora JSON inválido e retorna o valor padrão', () => {
  globalThis.localStorage = {
    getItem: () => '{invalido',
    setItem: () => {},
    removeItem: () => {},
  }

  assert.deepEqual(lerJson('progresso', {}), {})
})
