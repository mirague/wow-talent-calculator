import im from 'immutable'
import { setPointsInTree } from './tree'

it('sets points on an empty tree', () => {
  const tree = im.List()
  expect(setPointsInTree(tree, 2, 5).toJS()).toEqual([0, 0, 5])
})

it('sets points in the end of the current range', () => {
  const tree = im.List([0, 1])
  expect(setPointsInTree(tree, 2, 5).toJS()).toEqual([0, 1, 5])
})
it('sets points in the middle of the current range', () => {
  const tree = im.List([0, 0, 0, 0, 0, 0, 5])
  expect(setPointsInTree(tree, 2, 5).toJS()).toEqual([0, 0, 5, 0, 0, 0, 5])
})

it('does not mutate the tree for points already set', () => {
  const tree = im.List([0, 3, 2, 0, 5])
  expect(setPointsInTree(tree, 1, 3)).toStrictEqual(tree)
})