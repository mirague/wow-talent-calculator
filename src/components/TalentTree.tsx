import React, { MouseEvent, useCallback } from 'react'
import { Map }  from 'immutable'
import { TalentSlot } from './TalentSlot';
import { getPointsInSpec } from '../lib/tree';
import { talentsBySpec, specNames } from '../data/talents';

interface Props {
  specId: number
  availablePoints: number
  knownTalents: Map<number, number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ specId, knownTalents, availablePoints, onTalentPress }) => {
  const talents = Object.values(talentsBySpec[specId])

  const handleTalentPress = useCallback((talentId: number, modifier: 1 | -1) => {
    return (e: MouseEvent) => {
      onTalentPress(specId, talentId, modifier)
    }
  }, [specId, onTalentPress])

  const style = { 
    backgroundImage: `url("https://wow.zamimg.com/images/wow/talents/backgrounds/classic/${specId}.jpg")`
  }

  return (
    <div className="tree" style={style}>
      <h2>{specNames[specId]} ({getPointsInSpec(specId, knownTalents)})</h2>
      {talents.map((talent, index) => 
        <TalentSlot 
          key={talent.id}
          specId={specId}
          talent={talent}
          availablePoints={availablePoints}
          knownTalents={knownTalents}
          onClick={handleTalentPress(talent.id, 1)}
          onRightClick={handleTalentPress(talent.id, -1)}
        />
      )}
    </div>
  )
}

(TalentTree as any).whyDidYouRender = true