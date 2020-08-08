/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, Options, Context } from '../types'

export const setStateValue = (state: State, value: unknown): State => ({
  ...state,
  value,
})
export const getStateValue = (state: State): any => state.value

export const setValueFromState = (state: State, { value }: State): State => ({
  ...state,
  value,
})

export const contextFromState = ({
  rev = false,
  onlyMapped = false,
}: State): Context => ({
  rev,
  onlyMappedValues: onlyMapped,
})

export const populateState = ({
  rev = false,
  onlyMapped = false,
}: Partial<State>) => (data: unknown): State => ({
  root: data,
  context: data,
  value: data,
  rev,
  onlyMapped,
})

export const shouldSkipMutation = ({ mutateNull = true }: Options) => (
  state: State
): boolean => state.value === undefined || (!mutateNull && state.value === null)
