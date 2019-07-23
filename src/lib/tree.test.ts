import im, {
  Map
} from 'immutable'
import {
  canUnlearnTalent, canLearnTalent
} from './tree'
import {
  talentsById
} from '../data/talents'

const createKnownTalents = (obj: object): Map <number, number> => {
    let m = Map<number, number>()
    Object.keys(obj).forEach((key) => {
      m = m.set(parseInt(key, 10), obj[key])
    })
    return m
  }

const ROGUE_TALENTS = createKnownTalents({
  241: 5, // Master of Deception
  181: 5,
  186: 5,
  187: 5,
  244: 5,
  245: 3,
  246: 3,
  262: 3,
  263: 2,
  265: 2,
  284: 1,
  381: 1,
  1123: 3,
  1700: 2,
  1701: 2,
  1702: 5
})

describe('canUnlearnTalent', () => {
  it('returns false for the incorrect Rogue talent case', () => {
    const result = canUnlearnTalent(ROGUE_TALENTS, talentsById[241])
    expect(result).toBe(false)
  })

  it('returns false if no points are spent for the talent', () => {
    const result = canUnlearnTalent(Map(), talentsById[241])
    expect(result).toBe(false)
  })

  it('returns false if the talent is a dependency for another learnt talent', () => {
    // http://localhost:3000/rogue/-00505001
    const known = createKnownTalents({
      186: 5, // Row 1
      187: 5, // Row 2
      301: 1, // Row 3
    })
    const result = canUnlearnTalent(known, talentsById[187])
    expect(result).toBe(false)
  })

  it('returns true with points only spent in the first row', () => {
    const known = createKnownTalents({
      241: 5
    })
    const result = canUnlearnTalent(known, talentsById[241])
    expect(result).toBe(true)
  })
})

describe('canLearnTalent', () => {
  it('returns false if 51 points are already spent', () => {
    // http://localhost:3000/rogue/-005055010055505-55005
    const known = createKnownTalents({
      "181": 5,
      "182": 5,
      "184": 5,
      "186": 5,
      "187": 5,
      "221": 5,
      "222": 1,
      "241": 5,
      "242": 4,
      "244": 5,
      "261": 5,
      "301": 1
    })
    const result = canLearnTalent(known, talentsById[222])
    expect(result).toBe(false)
  })

  it('returns true for talent in the first row', () => {
    const result = canLearnTalent(Map(), talentsById[186])
    expect(result).toBe(true)
  })
})