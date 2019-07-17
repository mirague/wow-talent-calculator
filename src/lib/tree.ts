import { List, Map, fromJS } from 'immutable'
import { talentsBySpec, talentToSpec } from '../data/talents';

export const MAX_POINTS = 51

/**
 * Returns the overall points spent in the tree.
 */
export function getPointsInSpec(specId: number, known: Map<number, number>): number {
  // TODO: Hard to test this method when referencing talents from a file. Improve this.
  return Object.values(talentsBySpec[specId]).reduce((prev: number, current: TalentData) => {
    return prev + known.get(current.id, 0)
  }, 0)
}

export function calcAvailablePoints(known: Map<number, number>): number {
  return Math.max(0, MAX_POINTS - known.reduce((prev, current) => prev + current, 0))
}

/**
 * Returns whether a talent's other talent requirements are met.
 */
export function calcMeetsRequirements(talent: TalentData, known: Map<number, number>): boolean {
  if (talent.requires.length === 0) {
    return true
  }
  return talent.requires.reduce((prev, current) => {
    if (!prev) return false
    return known.get(current.id, 0) >= current.qty
  }, true)
}

/**
 * Adds a single talent point to the Map, if possible.
 */
export const addTalentPoint = (known: Map<number, number>, talent: TalentData): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)
  
  // Support for specific Talent dependency requirement.
  if (talent.requires.length > 0 && !calcMeetsRequirements(talent, known)) {
    return known
  }
  
  // Spend a maximum of 51 points
  if (calcAvailablePoints(known) === 0) {
    return known
  }
  
  // Check we have the required amount of points spent in the tree for this talent
  const requiredPoints = talent.row * 5
  const pointsInSpec = getPointsInSpec(talentToSpec[talent.id], known)
  if (requiredPoints > pointsInSpec) {
    return known
  }
  
  // Reached the max rank?
  if (currentPoints >= talent.ranks.length) {
    return known
  }

  return known.set(talent.id, currentPoints + 1)
}

/**
 * Removes a single talent point from the Map, if possible.
 */
export const removeTalentPoint = (known: Map<number, number>, talent: TalentData): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)
  
  // TODO: We should prevent reducing talent points on a row when it is a dependency for points already spent in the next row.

  // Already no points for this talent
  if (currentPoints === 0) {
    return known
  }

  return currentPoints === 1 
    ? known.remove(talent.id)
    : known.set(talent.id, currentPoints - 1)
}

/**
 * Either adds or removes a talent point based on the modifier.
 */
export const modifyTalentPoint = (known: Map<number, number>, talent: TalentData, modifier: 1 | -1): Map<number, number> => {
  if (modifier === 1) {
    return addTalentPoint(known, talent)
  } else {
    return removeTalentPoint(known, talent)
  }
}

// TODO
export function parsePointString(str: string): List<List<number>> {
  const list: Array<number[]> = []
  const trees = str.split('-')

  trees.map((stringForTree, index) => {
    const points = stringForTree.split('').map(a => parseInt(a, 10))
    list[index] = points
  })

  return fromJS(list)
}