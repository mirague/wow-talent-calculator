import { Map } from 'immutable'
import { SORT_TALENTS_BY_SPEC } from './tree'
import { talentsById } from '../data/talents'

export const debugPrintKnown = (known: Map<number, number>) => {
  const obj = {}
  known.toArray()
    .map(([talentId]) => talentsById[talentId])
    .sort(SORT_TALENTS_BY_SPEC)
    .forEach(talent => { obj[talent.id] = known.get(talent.id) })

  console.log(JSON.stringify(obj, null, 2))
}