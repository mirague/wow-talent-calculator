import './TalentTree.scss'
import React, { useCallback } from 'react'
import { Map }  from 'immutable'
import { Talent } from './Talent';
import { getPointsInSpec, canLearnTalent, SORT_TALENTS_DESC, getUnmetRequirements } from '../lib/tree';
import { talentsBySpec, specNames, talentsById } from '../data/talents'
import { Arrow } from './Arrow'
import { resetSpec } from '../store/calculator/actions'
import { connect } from 'react-redux';

interface Props {
  specId: number
  availablePoints: number
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
  resetSpec?: typeof resetSpec
}

export const TalentTree: React.FC<Props> = ({ specId, knownTalents, availablePoints, onTalentPress, resetSpec }) => {
  const talents = Object.values(talentsBySpec[specId]).sort(SORT_TALENTS_DESC)
  const pointsInSpec = getPointsInSpec(specId, knownTalents)

  const handleClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, 1), 
    [specId, onTalentPress]
  )
  const handleRightClick = useCallback(
    (talentId) => onTalentPress(specId, talentId, -1), 
    [specId, onTalentPress]
  )
  const handleResetSpec = useCallback(
    resetSpec ? () => resetSpec(specId) : () => {},
    [resetSpec, specId]
  )

  return (
    <div className="tree">
      <div className="tree__header">
        <h3>{specNames[specId]} ({pointsInSpec})</h3>
        {pointsInSpec > 0 && 
          <div className="tree__reset" onClick={handleResetSpec}>x</div>
        }
      </div>

      <div className="tree__body" style={{ backgroundImage: `url(${require(`../images/specs/${specId}.jpg`)})` }}>
        {talents.map((talent) => {
          const points = knownTalents.get(talent.id, 0)
          const canLearn = canLearnTalent(knownTalents, talent)
          const unmetRequirements = getUnmetRequirements(talent, knownTalents, pointsInSpec, specNames[specId])

          return <React.Fragment key={talent.id}>
            <Talent
              talent={talent}
              points={points}
              errors={unmetRequirements}
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

export default connect(
  null,
  { resetSpec }
)(TalentTree)