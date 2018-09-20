import test from 'ava'

import value from './value'

test('should set value', (t) => {
  const state = {
    root: {},
    context: {},
    value: 'Something'
  }
  const expected = {
    root: {},
    context: {},
    value: 'Splendid!'
  }

  const ret = value('Splendid!')(state)

  t.deepEqual(ret, expected)
})

test('should not set value when onlyMapped', (t) => {
  const state = {
    root: {},
    context: {},
    value: 'Something',
    onlyMapped: true
  }
  const expected = {
    root: {},
    context: {},
    value: undefined,
    onlyMapped: true
  }

  const ret = value('Splendid!')(state)

  t.deepEqual(ret, expected)
})
