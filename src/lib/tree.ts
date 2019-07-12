import im from 'immutable'

export function setPointsInTree(tree: im.List<number>, index: number, points: number) {
  // Ensure all values until `index` are set, otherwise set to 0
  for (let i = tree.size; i <= index; i++) {
    tree = tree.set(i, i === index ? points : 0)
  }
  return tree
}