import im from 'immutable'
import { 
  // setTalentPointsInTree, 
  getPointsInSpec 
} from './tree'


// describe('setTalentPointsInTree', () => {
//   it('sets points on an empty tree', () => {
//     const tree = im.List()
//     expect(setTalentPointsInTree(tree, 2, 5).toJS()).toEqual([0, 0, 5])
//   })
  
//   it('sets points in the end of the current range', () => {
//     const tree = im.List([0, 1])
//     expect(setTalentPointsInTree(tree, 2, 5).toJS()).toEqual([0, 1, 5])
//   })
  
//   it('sets points in the middle of the current range', () => {
//     const tree = im.List([0, 0, 0, 0, 0, 0, 5])
//     expect(setTalentPointsInTree(tree, 2, 5).toJS()).toEqual([0, 0, 5, 0, 0, 0, 5])
//   })
  
//   it('does not mutate the tree for points already set', () => {
//     const tree = im.List([0, 3, 2, 0, 5])
//     expect(setTalentPointsInTree(tree, 1, 3)).toStrictEqual(tree)
//   })
// })

// describe('getTreePointCount', () => {
//   it('returns proper count', () => {
//     const result = getPointsInSpec(im.List([0, 0, 4, 5, 3, 0, 0]))
//     expect(result).toBe(12)
//   })

//   it('returns 0 for empty list', () => {
//     const result = getPointsInSpec(im.List())
//     expect(result).toBe(0)
//   })
// })