import { setTargetOnState } from '../utils/stateHelpers.js'
import { defsToDataMapper } from '../utils/definitionHelpers.js'
import { Operands, Path, DataMapper, Options } from '../types.js'

interface CompareOperands extends Operands {
  path?: Path | Path[]
  operator?: string
}

export default function compare(
  { path = '.', operator = 'AND' }: CompareOperands,
  _options: Options = {}
): DataMapper {
  const pathArr = ([] as string[]).concat(path)
  const getFns = pathArr.map(defsToDataMapper)
  const setFns = pathArr.map((path) => `>${path}`).map(defsToDataMapper)
  const logicalOp =
    operator === 'OR'
      ? (a: unknown, b: unknown) => Boolean(a) || Boolean(b)
      : (a: unknown, b: unknown) => Boolean(a) && Boolean(b)

  return (data, state) => {
    if (state.rev) {
      const value = Boolean(data)
      return setFns.reduce(
        (obj: unknown, setFn) =>
          setFn(value, setTargetOnState({ ...state, rev: false }, obj)), // Do a regular set regardless of direction
        undefined
      )
    } else {
      const values = getFns.map((fn) => fn(data, state))
      return values.reduce(logicalOp)
    }
  }
}
