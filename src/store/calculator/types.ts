import { Map } from 'immutable'

export type Points = Map<number, number>

export interface CalculatorState {
  classId: number
  points: Points
  pointsEncoded: string
}

export const SET_CLASS = 'SET_CLASS'
export const ADD_POINT = 'ADD_POINT'
export const REMOVE_POINT = 'REMOVE_POINT'
export const SET_POINTS = 'SET_POINTS'
export const RESET_SPEC = 'RESET_SPEC'

interface SetClassAction {
  type: typeof SET_CLASS
  classId: number
  points?: Points
}

interface AddPointAction {
  type: typeof ADD_POINT
  talentId: number
}

interface RemovePointAction {
  type: typeof REMOVE_POINT
  talentId: number
}

interface SetPointsAction {
  type: typeof SET_POINTS
  points: Points
}

interface ResetSpecAction {
  type: typeof RESET_SPEC
  specId: number
}

export type CalculatorActionTypes = SetClassAction | AddPointAction | RemovePointAction | 
  SetPointsAction | ResetSpecAction