import React, { useCallback } from 'react'
import { Map }  from 'immutable'
import { TalentSlot } from './TalentSlot';
import { getPointsInSpec, canLearnTalent } from '../lib/tree';
import { talentsBySpec, specNames, talentsById } from '../data/talents'
import { Arrow } from './Arrow'

interface Props {
  specId: number
  availablePoints: number
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ specId, knownTalents, availablePoints, onTalentPress }) => {
  const talents = Object.values(talentsBySpec[specId])

  const handleClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, 1), 
    [specId, onTalentPress]
  )
  const handleRightClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, -1), 
    [specId, onTalentPress]
  )

  const bodyStyle = { 
    backgroundImage: `url("https://wow.zamimg.com/images/wow/talents/backgrounds/classic/${specId}.jpg")`
  }

  const arrows = talents
    .filter((talent) => talent.requires.length > 0)
    .map((talent) => {
      return <Arrow 
        key={talent.id}
        from={talentsById[talent.requires[0].id]}
        to={talent}
        active={knownTalents.get(talent.id, 0) > 0 || canLearnTalent(knownTalents, talent)}
      />
    })

  return (
    <div className="tree">
      <div className="tree__header">
        <h3>{specNames[specId]} ({getPointsInSpec(specId, knownTalents)})</h3>
      </div>

      <div className="tree__body" style={bodyStyle}>
        {talents.map((talent) => 
          <TalentSlot 
            key={talent.id}
            specId={specId}
            talent={talent}
            availablePoints={availablePoints}
            knownTalents={knownTalents}
            onClick={handleClick}
            onRightClick={handleRightClick}
          />
        )}

        {arrows}
      </div>
    </div>
  )
}

;(TalentTree as any).whyDidYouRender = true