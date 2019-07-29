export interface ConfigState {
  alwaysShowPoints: boolean
}

export const SET_CONFIG_VALUE = 'SET_CONFIG_VALUE'

interface SetConfigValueAction {
  type: typeof SET_CONFIG_VALUE
  key: string
  value: any
}

export type ConfigActionTypes = SetConfigValueAction