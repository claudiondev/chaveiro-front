import assert from 'node:assert/strict'
import test from 'node:test'
import { devePrevalecer } from './precedencia.js'

test('aceita o primeiro progresso e versões mais novas', () => {
  assert.equal(devePrevalecer(null, { versao: 1, status: 'DISPENSADO' }), true)
  assert.equal(
    devePrevalecer(
      { versao: 1, status: 'CONCLUIDO' },
      { versao: 2, status: 'DISPENSADO' }
    ),
    true
  )
})

test('rejeita versões antigas', () => {
  assert.equal(
    devePrevalecer(
      { versao: 2, status: 'DISPENSADO' },
      { versao: 1, status: 'CONCLUIDO' }
    ),
    false
  )
})

test('não troca conclusão por dispensa na mesma versão', () => {
  assert.equal(
    devePrevalecer(
      { versao: 1, status: 'CONCLUIDO' },
      { versao: 1, status: 'DISPENSADO' }
    ),
    false
  )
})
