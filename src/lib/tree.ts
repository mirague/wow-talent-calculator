import { List, Map, fromJS } from 'immutable'

/**
 * Sets proper values for a tree, filling in 0s in between.
 */
export function setTalentPointsInTree(tree: List<number>, talentIndex: number, points: number): List<number> {
  // Ensure all values until `index` are set, otherwise set to 0
  for (let i = tree.size; i < talentIndex; i++) {
    tree = tree.set(i, 0)
  }
  return tree.set(talentIndex, points)
}

/**
 * Returns the overall points spent in the tree.
 */
export function getTreePointCount(tree: List<number>): number {
  return tree.reduce((reduction, value) => value + reduction, 0)
}

export function canRemovePoint() {

}

export function canSetPoint() {
  
}

export const modifyPointsInTree = (tree: List<number>, talent: TalentData, talentIndex: number, modifier: 1 | -1): List<number> => {
  const currentPoints = tree.get(talentIndex, 0)

  // TODO: We should prevent reducing talent points on a row when it is a dependency for points already spent in the next row.
  
  // TODO: Support for specific Talent dependency requirement.

  // TODO: Spend a maximum of 51 points

  // Check we have the required amount of points spent in the tree for this talent
  const requiredPoints = talent.row * 5
  const spentPointCount = getTreePointCount(tree)
  if (requiredPoints > spentPointCount) return tree

  let newPoints = currentPoints
  if (modifier === 1) {
    if (currentPoints === talent.ranks.length) return tree
    newPoints = currentPoints + 1
  } else if (modifier === -1) {
    if (currentPoints === 0) return tree
    newPoints = currentPoints - 1
  }

  return setTalentPointsInTree(tree, talentIndex, newPoints)
}

export const modifyKnownTalents = (known: Map<number, number>, talent: TalentData, modifier: 1 | -1): Map<number, number> => {
  const currentPoints = known.get(talent.id, 0)

  // TODO: We should prevent reducing talent points on a row when it is a dependency for points already spent in the next row.
  
  // TODO: Support for specific Talent dependency requirement.

  // TODO: Spend a maximum of 51 points

  // TODO: Check we have the required amount of points spent in the tree for this talent
  const requiredPoints = talent.row * 5
  // const spentPointCount = known.get(talent.id, 0)
  // if (requiredPoints > spentPointCount) return tree

  let newPoints = currentPoints
  if (modifier === 1) {
    if (currentPoints === talent.ranks.length) return known
    newPoints = currentPoints + 1
  } else if (modifier === -1) {
    if (currentPoints === 0) return known
    newPoints = currentPoints - 1
  }

  return newPoints === 0 
    ? known.remove(talent.id)
    : known.set(talent.id, newPoints)
}

export function parsePointString(str: string): List<List<number>> {
  const list: Array<number[]> = []
  const trees = str.split('-')

  trees.map((stringForTree, index) => {
    const points = stringForTree.split('').map(a => parseInt(a, 2))
    list[index] = points
  })

  return fromJS(list)
}