import { Map } from 'immutable'
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

export const SORT_TALENTS_DESC = (a: TalentData, b: TalentData) => {
  if (a.row === b.row) {
    return b.col - a.col
  }
  return b.row - a.row
}

export const SORT_TALENTS_BY_SPEC = (a: TalentData, b: TalentData) => {
  const aSpec = talentToSpec[a.id]
  const bSpec = talentToSpec[b.id]
  if (aSpec === bSpec) {
    return SORT_TALENTS(a, b)
  }
  return aSpec - bSpec
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

export const canLearnTalent = (known: Map<number, number>, talent: TalentData): boolean => {
   // Reached the max rank?
   if (known.get(talent.id, 0) >= talent.ranks.length) {
    return false
  }

  // Spend a maximum of 51 points
  if (calcAvailablePoints(known) === 0) {
    return false
  }
  
  // Support for specific Talent dependency requirement.
  if (talent.requires.length > 0 && !calcMeetsRequirements(talent, known)) {
    return false
  }
  
  // Check we have the required amount of points spent in the tree for this talent
  const requiredPoints = talent.row * 5
  const pointsInSpec = getPointsInSpec(talentToSpec[talent.id], known)
  if (requiredPoints > pointsInSpec) {
    return false
  }

  return true
}

export const getCumulativePointsPerRow = (known: Map<number, number>, specId: number): number[] => {
  return known.reduce((reduction, points, talentId) => {
    const t = talentsBySpec[specId][talentId]
    if (t && points > 0) {
      for (let row = t.row; row < MAX_ROWS; row++) {
        reduction[row] = (reduction[row] || 0) + points
      }
    }
    return reduction
  }, [])
}

export const canUnlearnTalent = (known: Map<number, number>, talent: TalentData): boolean => {
  const currentPoints = known.get(talent.id, 0)
  const specId = talentToSpec[talent.id]

  // No points to reduce for this talent
  if (currentPoints === 0) {
    console.warn('no points to reduce')
    return false
  }

  // Prevent if another talent depends on this 
  const isDependency = known.some((points, talentId) => {
    const t = talentsBySpec[specId][talentId]
    return t && points > 0 && t.requires.some((req) => req.id === talent.id)
  })
  if (isDependency) {
    console.warn('is dependency')
    return false
  }
  
  // Walk through every talent and ensure no requirements are breached
  let cumulativePointsPerRow = getCumulativePointsPerRow(known, specId)
  for (let r = talent.row; r < cumulativePointsPerRow.length; r++) {
    // Calculate what the points would look like when this one is removed
    cumulativePointsPerRow[r] = cumulativePointsPerRow[r] - 1
  }
  const wouldBreach = known.some((points, talentId) => {
    const t = talentsBySpec[specId][talentId]
    return t && points > 0 && t.row > 0 && cumulativePointsPerRow[t.row - 1] < t.row * 5
  })
  if (wouldBreach) {
    console.warn('point requirements would be breached')
    return false
  }

  return true
}

/**
 * Adds a single talent point to the Map, if possible.
 */
export const addTalentPoint = (known: Map<number, number>, talent: TalentData): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)
  
  if (!canLearnTalent(known, talent)) {
    return known
  }

  return known.set(talent.id, currentPoints + 1)
}

/**
 * Removes a single talent point from the Map, if possible.
 */
export const removeTalentPoint = (known: Map<number, number>, talent: TalentData): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)

  if (!canUnlearnTalent(known, talent)) {
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
  const { specs } = classByName[className]
  let known = Map<number, number>()

  // TODO: Make sure we validate the point string
  const parts = pointString.split('-')
  for (let i = 0; i < parts.length; i++) {
    const specId = specs[i]
    const specPointStr = parts[i]
    const talents = talentsBySpecArray[specId].sort(SORT_TALENTS)

    for (let y = 0; y < specPointStr.length; y++) {
      const talent = talents[y]
      const points = parseInt(specPointStr[y], 10)
      
      // Validation: break out loop if there's more points in the string than this talent can have
      if (points > talent.ranks.length) {
        break
      }
      
      if (points > 0) {
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