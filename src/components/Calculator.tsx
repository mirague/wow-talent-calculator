import React, { useState } from 'react';
import { List, Map, fromJS } from 'immutable'
import { TalentTree } from './TalentTree';
import { modifyPointsInTree, modifyKnownTalents } from '../lib/tree';
import { talentsBySpec, specNames } from '../data/talents';
import { classByName } from '../data/classes';
import { number } from 'prop-types';

const createTalent = (name: string, row: number, column: number, ranks: string | string[], type: Talent['type'] = 'talent'): Talent => {
  return { 
    name,
    row,
    column,
    ranks: typeof ranks === 'string' ? [ranks] : ranks, 
    type
  }
}

/**
 * Max rows: 7
 * Max cols: 4
 * 
 * verify: no talent on same [row, column] combination
 * potentially: sort talents based on row and column so order doesn't matter
 */

const warlockTalents: TalentTree[] = [
  // Affliction
  {
    id: 164,
    name: 'Affliction',
    icon: 'https://wow.zamimg.com/images/wow/icons/small/spell_shadow_deathcoil.jpg',
    talents: [
      // Row 1
      createTalent('Suppression', 0, 1, [
        'Reduces the chance for enemies to resist your Affliction spells by 2%.',
        'Reduces the chance for enemies to resist your Affliction spells by 4%.',
        'Reduces the chance for enemies to resist your Affliction spells by 6%.',
        'Reduces the chance for enemies to resist your Affliction spells by 8%.',
        'Reduces the chance for enemies to resist your Affliction spells by 10%.',
      ]),
      createTalent('Improved Corruption', 0, 2, [
        'Reduces the casting time of your corruption spell by 0.4 sec.',
        'Reduces the casting time of your corruption spell by 0.8 sec.',
        'Reduces the casting time of your corruption spell by 1.2 sec.',
        'Reduces the casting time of your corruption spell by 1.6 sec.',
        'Reduces the casting time of your corruption spell by 2 sec.',
      ]),

      // Row 2
      createTalent('Improved Curse of Weakness', 1, 0, [
        'Increases the effect of your Curse of Weakness by 6%.',
        'Increases the effect of your Curse of Weakness by 13%.',
        'Increases the effect of your Curse of Weakness by 20%.'
      ]),
      createTalent('Improved Drain Soul', 1, 1, [
        'Gives you a 50% chance to get a 100% increase to your Mana regeneration for 10 sec if the target is killed by you while you drain its soul. In addition your Mana may continue to regenerate while casting at 50% of normal.',
        'Gives you a 100% chance to get a 100% increase to your Mana regeneration for 10 sec if the target is killed by you while you drain its soul. In addition your Mana may continue to regenerate while casting at 50% of normal.',
      ]),
      createTalent('Improved Life Tap', 1, 2, [
        'Increases the amount of Mana awarded by your Life Tap spell by 10%.',
        'Increases the amount of Mana awarded by your Life Tap spell by 20%.',
      ]),
      createTalent('Improved Drain Life', 1, 3, [
        'Increases the Health drained by your Drain Life spell by 2%.',
        'Increases the Health drained by your Drain Life spell by 4%.',
        'Increases the Health drained by your Drain Life spell by 6%.',
        'Increases the Health drained by your Drain Life spell by 8%.',
        'Increases the Health drained by your Drain Life spell by 10%.',
      ]),

      // Row 3
      createTalent('Improved Curse of Agony', 2, 0, [
        'Increases the damage done by your Curse of Agony by 2%.',
        'Increases the damage done by your Curse of Agony by 4%.',
        'Increases the damage done by your Curse of Agony by 6%.',
      ]),
      createTalent('Fel Concentration', 2, 1, [
        'Gives you a 14% chance to avoid interruption caused by damage while channeling the Drain Life, Drain Mana, or Drain Soul spell.',
        'Gives you a 28% chance to avoid interruption caused by damage while channeling the Drain Life, Drain Mana, or Drain Soul spell.',
        'Gives you a 42% chance to avoid interruption caused by damage while channeling the Drain Life, Drain Mana, or Drain Soul spell.',
        'Gives you a 56% chance to avoid interruption caused by damage while channeling the Drain Life, Drain Mana, or Drain Soul spell.',
        'Gives you a 70% chance to avoid interruption caused by damage while channeling the Drain Life, Drain Mana, or Drain Soul spell.',
      ]),
      createTalent('Amplify Curse', 2, 2, [
        'Increases the effect of your next Curse of Weakness or Curse of Agony by 50%, or your next Curse of Exhaustion by 20%. Lasts 30 sec.',
      ]),
    ]
  }
  // Demonoloy

  // Destruction
]

interface Props {
  forClass: string
  pointString?: string // e.g. 2305302300--001
}

const initialSpentPoints: List<List<number>> = fromJS([
  [], [], []
])

const initMap = Map<number, number>()

export const Calculator: React.FC<Props> = ({ forClass = 'warlock', pointString = '' }) => {
  const [knownTalents, setKnownTalents] = useState(initMap)
  const [spentPoints, setSpentPoints] = useState(initialSpentPoints)

  const selectedClass = classByName[forClass]

  console.log(knownTalents)

  const handleTalentPress = (specId: number, talentId: number, modifier: 1 | -1) => {
    console.log('onTalentPress', { specId, talentId, modifier })

    const talent = talentsBySpec[specId][talentId]

    
    setKnownTalents(modifyKnownTalents(knownTalents, talent, modifier))

  }
  
  return (
    <div className="calculator">
      {selectedClass.specs.map((specId, specIndex) => (
        <TalentTree
          key={specId}
          specId={specId}
          knownTalents={knownTalents}
          spentPoints={spentPoints.get(specIndex)} 
          onTalentPress={handleTalentPress}
        />
      ))}
    </div>
  )
}