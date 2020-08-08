/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeDeepWith, identity } from 'ramda'
import { compose } from './functional'
import { Path } from '../types'

const preparePathPart = (part: string, isAfterOpenArray: boolean) =>
  isAfterOpenArray ? `]${part}` : part

const pathSplitter = function* (path: Path) {
  const regEx = /([^[\].]+|\[\w*])/g
  let match
  let isAfterOpenArray = false
  do {
    match = regEx.exec(path)
    if (match) {
      yield preparePathPart(match[0], isAfterOpenArray)
      isAfterOpenArray = isAfterOpenArray || match[0] === '[]'
    }
  } while (match !== null)
}

const split = (path: Path): string[] => [...pathSplitter(path)]

const setOnObject = (prop: string) => (value: unknown): any => ({
  [prop]: value,
})

const setOnOpenArray = (value: unknown) =>
  Array.isArray(value) ? value : typeof value === 'undefined' ? [] : [value]

const setOnArrayIndex = (index: number, value: unknown) => {
  const arr: unknown[] = []
  // eslint-disable-next-line security/detect-object-injection
  arr[index] = value
  return arr
}

const setOnArray = (prop: string) => (value: unknown) => {
  const index = parseInt(prop.substr(1), 10)
  return isNaN(index) ? setOnOpenArray(value) : setOnArrayIndex(index, value)
}

const setOnSubArray = (prop: string) => (value: unknown) =>
  ([] as unknown[]).concat(value).map(setOnObject(prop.substr(1)))

const setter = (prop: string) => {
  switch (prop[0]) {
    case '[':
      return setOnArray(prop)
    case ']':
      return setOnSubArray(prop)
    default:
      return setOnObject(prop)
  }
}

export function mergeExisting<T, U>(
  left: T[],
  right: U | U[]
): U | (U | T | (U & T))[] {
  if (Array.isArray(right)) {
    return right.reduce((arr, value, index) => {
      // eslint-disable-next-line security/detect-object-injection
      arr[index] = mergeDeepWith(mergeExisting, left[index], value)
      return arr
    }, left)
  }
  return right
}

export type SetFunction = (value: unknown, object?: unknown) => any

/**
 * Set `value` at `path` in `object`. Note that a new object is returned, and
 * the provided `object` is not mutated.
 *
 * Path may be a simple dot notation, and may include array brackets with or
 * without an index specified.
 *
 * @param {string} path - The path to set the value at
 * @returns {function} A setter function accepting a value and a target object
 */
export default function pathSetter(path: Path): SetFunction {
  const setters = split(path).map(setter)

  if (setters.length === 0) {
    return identity
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setterFn = compose(...(setters as any))
  return (value, object: unknown = null) => {
    const data = setterFn(value)
    return object ? mergeDeepWith(mergeExisting, object, data) : data
  }
}
