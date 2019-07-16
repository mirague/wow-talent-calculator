import React, { MouseEvent } from 'react'
import { List, Map }  from 'immutable'
import { TalentSlot } from './TalentSlot';
import { getTreePointCount } from '../lib/tree';
import { talentsBySpec, specNames } from '../data/talents';

interface Props {
  specId: number
  spentPoints: List<number>
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ specId, spentPoints, knownTalents, onTalentPress }) => {
  const talents = Object.values(talentsBySpec[specId])

  const handleTalentPress = (talentId: number) => {
    return (e: MouseEvent) => {
      onTalentPress(specId, talentId, e.shiftKey ? -1 : 1)
    }
  }

  return (
    <div className="tree">
      <h2>{specNames[specId]}</h2>
      {talents.map((talent, index) => 
        <TalentSlot 
          key={talent.id}
          talent={talent}
          points={knownTalents.get(talent.id, 0)}
          onClick={handleTalentPress(talent.id)}
        />
      )}

      Spent: {getTreePointCount(spentPoints)}
    </div>
  )
}