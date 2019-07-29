import { 
  CalculatorActionTypes, 
  SET_CLASS, 
  ADD_POINT,
  REMOVE_POINT,
  SET_POINTS,
  Points,
} from './types'

export const setClass = (classId: number, points?: Points): CalculatorActionTypes => ({
  type: SET_CLASS,
  classId,
  points
})

export const addPoint = (talentId: number): CalculatorActionTypes => ({
  type: ADD_POINT,
  talentId
})

export const removePoint = (talentId: number): CalculatorActionTypes => ({
  type: REMOVE_POINT,
  talentId
})

export const setPoints = (points: Points): CalculatorActionTypes => ({
  type: SET_POINTS,
  points
})