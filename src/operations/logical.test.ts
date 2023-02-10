import test from 'ava'
import compare from '../transformers/compare.js'
import { identity } from '../utils/functional.js'

import { and, or } from './logical.js'

// Setup

const options = {
  transformers: { compare },
}

// Tests -- and

test('should run pipelines and logical AND them - with result true', (t) => {
  const def0 = { $filter: 'compare', path: 'a', match: 1 }
  const def1 = { $filter: 'compare', path: 'b', match: 2 }
  const state = {
    context: [],
    value: { a: 1, b: 2 },
  }
  const expected = {
    context: [],
    value: true,
  }

  const ret = and(def0, def1)(options)(identity)(state)

  t.deepEqual(ret, expected)
})

test('should run pipelines and logical AND them - with result false', (t) => {
  const def0 = { $filter: 'compare', path: 'a', match: 1 }
  const def1 = { $filter: 'compare', path: 'b', match: 3 } // Not matched
  const state = {
    context: [],
    value: { a: 1, b: 2 },
  }

  const ret = and(def0, def1)(options)(identity)(state)

  t.false(ret.value)
})

// Tests -- or

test('should run pipelines and logical OR them - with result true', (t) => {
  const def0 = { $filter: 'compare', path: 'a', match: 1 }
  const def1 = { $filter: 'compare', path: 'b', match: 3 } // Not matched
  const state = {
    context: [],
    value: { a: 1, b: 2 },
  }
  const expected = {
    context: [],
    value: true,
  }

  const ret = or(def0, def1)(options)(identity)(state)

  t.deepEqual(ret, expected)
})

test('should run pipelines and logical OR them - with result false', (t) => {
  const def0 = { $filter: 'compare', path: 'a', match: 2 } // Not matched
  const def1 = { $filter: 'compare', path: 'b', match: 3 } // Not matched
  const state = {
    context: [],
    value: { a: 1, b: 2 },
  }

  const ret = or(def0, def1)(options)(identity)(state)

  t.false(ret.value)
})
