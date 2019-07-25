import React, { useCallback } from 'react'
import { Map }  from 'immutable'
import { Talent } from './Talent';
import { getPointsInSpec, canLearnTalent, calcMeetsRequirements } from '../lib/tree';
import { talentsBySpec, specNames, talentsById, talentToSpec } from '../data/talents'
import { Arrow } from './Arrow'

interface Props {
  specId: number
  availablePoints: number
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ specId, knownTalents, availablePoints, onTalentPress }) => {
  const talents = Object.values(talentsBySpec[specId])
  const bgImg = require(`../images/specs/${specId}.jpg`)

  const handleClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, 1), 
    [specId, onTalentPress]
  )
  const handleRightClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, -1), 
    [specId, onTalentPress]
  )

  const arrows = talents
    .filter((talent) => talent.requires.length)
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

      <div className="tree__body" style={{ backgroundImage: `url(${bgImg})` }}>
        {talents.map((talent) => 
          <Talent 
            key={talent.id}
            talent={talent}
            points={knownTalents.get(talent.id, 0)}
            onClick={handleClick}
            onRightClick={handleRightClick}
            disabled={availablePoints === 0 || !isAvailable(talent, knownTalents)}
          />
        )}

        {arrows}
      </div>
    </div>
  )
}

// move this somewhere else/revise this
export const isAvailable = (talent: TalentData, knownTalents: Map<number, number>): boolean => {
  // Dependent on other talents?
  if (!calcMeetsRequirements(talent, knownTalents)) {
    return false
  }
  const specId = talentToSpec[talent.id]
  const pointsInSpec = getPointsInSpec(specId, knownTalents)
  return talent.row * 5 <= pointsInSpec
}

;(TalentTree as any).whyDidYouRender = true