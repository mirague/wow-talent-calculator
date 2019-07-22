import { List, Map, fromJS } from 'immutable'
import { 
  talentsBySpec, 
  talentToSpec, 
  talentsBySpecArray 
} from '../data/talents';
import { classByName } from '../data/classes'

export const MAX_POINTS = 51
export const MAX_ROWS = 7

export const SORT_TALENTS = (a: TalentData, b: TalentData) => {
  if (a.row === b.row) {
    return a.col - b.col
  }
  return a.row - b.row
}

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
  return talent.requires.reduce((prev, req) => {
    if (!prev) return false
    return known.get(req.id, 0) >= req.qty
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
    console.warn('no points to reduce')
    return known
  }
  
  let isDependency = false
  let highestRow = 0
  let cumulativePointsPerRow = {}

  known.forEach((points, talentId) => {
    const t = talentsBySpec[specId][talentId]
    if (t && points > 0) {
      isDependency = isDependency || t.requires.some((req) => req.id === talent.id)
      if (t.row > highestRow) {
        console.info('new highest row:', t)
      }
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
    console.warn('would not break the requirements for talents spent in later rows', { 
      talent,
      highestRow,
      pointsUntilHighestRow,
      targetPointsHighestRow
    })
    return known
  }

  // Prevent if another talent depends on this 
  if (isDependency) {
    console.warn('is dependency')
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

  trees.forEach((stringForTree, index) => {
    const points = stringForTree.split('').map(a => parseInt(a, 10))
    list[index] = points
  })

  return fromJS(list)
}

/**
 * Encodes a Map of known talents into a URL-friendly string.
 */
export function encodeKnownTalents(known: Map<number, number>, className: string): string {
  let string = ''
  const { specs } = classByName[className]
  for (let i = 0; i < specs.length; i++) {
    const specId = specs[i]
    const talents = talentsBySpecArray[specId].sort(SORT_TALENTS)
    string += i > 0 ? '-' : ''
    string += removeTrailingCharacters(
      talents.map((talent) => known.get(talent.id, 0)).join(''),
      '0'
    )
  }
  return removeTrailingCharacters(string, '-')
}

/**
 * Decodes a string of points into a Map of talents.
 */
export function decodeKnownTalents(pointString: string, className: string): Map<number, number> {
  console.log(pointString, className)

  const { specs } = classByName[className]
  let known = Map<number, number>()

  // TODO: Make sure we validate the point string
  const parts = pointString.split('-')
  for (let i = 0; i < parts.length; i++) {
    const specId = specs[i]
    const specPointStr = parts[i]
    console.log(specPointStr, { specId })
    const talents = talentsBySpecArray[specId].sort(SORT_TALENTS)

    for (let y = 0; y < specPointStr.length; y++) {
      const talent = talents[y]
      const points = parseInt(specPointStr[y], 10)
      
      // Validation: break out loop if there's more points in the string than this talent can have
      if (points > talent.ranks.length) {
        break
      }
      
      if (points > 0) {
        console.log(`Spent ${points} in ${talent.id}`)
        known = known.set(talent.id, points)
      }
    }
  }

  return known
}

/**
 * Removes repeated characters from the end of a string.
 */
function removeTrailingCharacters(str: string, char: string): string {
  while (str[str.length - 1] === char) {
    str = str.slice(0, -1)
  }
  return str
}