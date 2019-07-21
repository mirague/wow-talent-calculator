import { List, Map, fromJS } from 'immutable'
import { talentsBySpec, talentToSpec, talentsById } from '../data/talents';

export const MAX_POINTS = 51
export const MAX_ROWS = 7

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
  
  // Reached the max rank?
  if (currentPoints >= talent.ranks.length) {
    return known
  }

  // Spend a maximum of 51 points
  if (calcAvailablePoints(known) === 0) {
    return known
  }
  
  // Support for specific Talent dependency requirement.
  if (talent.requires.length > 0 && !calcMeetsRequirements(talent, known)) {
    return known
  }
  
  // Check we have the required amount of points spent in the tree for this talent
  const requiredPoints = talent.row * 5
  const pointsInSpec = getPointsInSpec(talentToSpec[talent.id], known)
  if (requiredPoints > pointsInSpec) {
    return known
  }

  return known.set(talent.id, currentPoints + 1)
}

/**
 * Removes a single talent point from the Map, if possible.
 */
export const removeTalentPoint = (known: Map<number, number>, talent: TalentData): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)
  const specId = talentToSpec[talent.id]

  // No points to reduce for this talent
  if (currentPoints === 0) {
    return known
  }
  
  let highestRow = 0
  let cumulativePointsPerRow = {}
  known.forEach((points, talentId) => {
    const t = talentsBySpec[specId][talentId]
    if (t) {
      highestRow = t.row > highestRow ? t.row : highestRow
      for (let row = t.row; row < MAX_ROWS; row++) {
        cumulativePointsPerRow[row] = (cumulativePointsPerRow[row] || 0) + points
      }
    }
  })

  // Check if removing this talent would not break the requirements for talents spent in later rows
  const pointsUntilHighestRow = cumulativePointsPerRow[highestRow - 1]
  const targetPointsHighestRow = highestRow * 5
  if (talent.row < highestRow && pointsUntilHighestRow - 1 < targetPointsHighestRow) {
    return known
  }

  // TODO: Prevent if another talent depends on this 
  // const isDependency = known.reduce((prev, current, key) => {
  //   if (prev) return prev
  //   const t = talentsBySpec[specId][key]
  //   if (t.requires.length === 0) {
  //     return false
  //   }
  //   t.requires.map((d) => d.id === talent.id ? d : undefined)
  // }, false)

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

  trees.forEach((stringForTree, index) => {
    const points = stringForTree.split('').map(a => parseInt(a, 10))
    list[index] = points
  })

  return fromJS(list)
}