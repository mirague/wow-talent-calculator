import './TalentTree.scss'
import React, { useCallback } from 'react'
import { Map }  from 'immutable'
import { Talent } from './Talent';
import { getPointsInSpec, canLearnTalent, SORT_TALENTS_DESC } from '../lib/tree';
import { talentsBySpec, specNames, talentsById } from '../data/talents'
import { Arrow } from './Arrow'

interface Props {
  specId: number
  availablePoints: number
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ specId, knownTalents, availablePoints, onTalentPress }) => {
  const talents = Object.values(talentsBySpec[specId]).sort(SORT_TALENTS_DESC)

  const handleClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, 1), 
    [specId, onTalentPress]
  )
  const handleRightClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, -1), 
    [specId, onTalentPress]
  )

  return (
    <div className="tree">
      <div className="tree__header">
        <h3>{specNames[specId]} ({getPointsInSpec(specId, knownTalents)})</h3>
      </div>

      <div className="tree__body" style={{ backgroundImage: `url(${require(`../images/specs/${specId}.jpg`)})` }}>
        {talents.map((talent) => {
          const points = knownTalents.get(talent.id, 0)
          const canLearn = canLearnTalent(knownTalents, talent)

          return <React.Fragment key={talent.id}>
            <Talent
              talent={talent}
              points={points}
              onClick={handleClick}
              onRightClick={handleRightClick}
              disabled={availablePoints === 0 || !canLearn}
            />

            {!!talent.requires.length &&
              <Arrow
                from={talentsById[talent.requires[0].id]}
                to={talent}
                active={points > 0 || canLearn}
              />
            }
          </React.Fragment>
        })}
      </div>
    </div>
  )
}

;(TalentTree as any).whyDidYouRender = true