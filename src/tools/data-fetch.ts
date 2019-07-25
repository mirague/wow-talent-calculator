// import '../src/types'
import { talentsById } from '../data/talents'
import fetch from 'node-fetch'
import fs from 'fs'
import cheerio from 'cheerio'
import spells from '../data/spells.json'

const getRankFromTooltip = (spellId: number, tooltip: string): number | null => {
  const matches = tooltip.match(/Rank (\d)/)
  if (!matches) {
    console.warn(`Spell ${spellId}: No rank found in tooltip: \n\t`, tooltip)
    return null
  }
  return parseInt(matches[1], 10)
}

const getUnknownSpellIds = (): number[] => {
  const allSpellIds = Object.values(talentsById).reduce((reduction, talent: TalentData) => {
    reduction = [...reduction, ...talent.ranks]
    return reduction
  }, [])

  return allSpellIds.filter(spellId => !spells[spellId.toString()])
}

export const fetchSpellData = async () => {
  const unknownSpellIds = getUnknownSpellIds()
  console.log(`Fetching spell data for ${unknownSpellIds.length} unknown spells`)

  const promises = unknownSpellIds.slice(0, 20).map(async (spellId): Promise<boolean> => {
    if (!spells[spellId.toString()]) {
      console.log(`Loading data for unknown spell: ${spellId}`)

      const res = await fetch(`https://classic.wowhead.com/tooltip/spell/${spellId}`)
      if (res.status !== 200) {
        console.error(`Could not find data for spell: ${spellId}`)
        return null
      }

      const json: any = await res.json()
      const $ = cheerio.load(json.tooltip)

      const spell: SpellData = {
        name: json.name,
        icon: json.icon,
        rank: getRankFromTooltip(spellId, json.tooltip),
        description: $('.q').text()
      }

      spells[spellId.toString()] = spell 
      return true
    }
  })

  await Promise.all(promises)

  fs.writeFileSync('./src/data/spells.json', JSON.stringify(spells, null, 2))

  if (getUnknownSpellIds().length > 0) {
    console.log('--- We have more unknown spells: ', getUnknownSpellIds().length)
    fetchSpellData()
  }
}

fetchSpellData()