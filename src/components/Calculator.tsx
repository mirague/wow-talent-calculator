import React, { useState } from 'react';
import { Map } from 'immutable'
import { TalentTree } from './TalentTree';
import { 
  modifyTalentPoint, 
  calcAvailablePoints
} from '../lib/tree';
import { talentsBySpec } from '../data/talents';
import { classByName } from '../data/classes';

interface Props {
  forClass: string
  pointString?: string // e.g. 2305302300--001
}

const initMap = Map<number, number>()

export const Calculator: React.FC<Props> = ({ forClass, pointString = '' }) => {
  const [knownTalents, setKnownTalents] = useState(initMap)
  const selectedClass = classByName[forClass]
  const availablePoints = calcAvailablePoints(knownTalents)

  const handleTalentPress = (specId: number, talentId: number, modifier: 1 | -1) => {
    const talent = talentsBySpec[specId][talentId]
    setKnownTalents(
      modifyTalentPoint(knownTalents, talent, modifier)
    )
  }
  
  return (
    <div className="calculator">
      <div className="trees">
        {selectedClass.specs.map((specId, specIndex) => (
          <TalentTree
            key={specId}
            specId={specId}
            availablePoints={availablePoints}
            knownTalents={knownTalents}
            onTalentPress={handleTalentPress}
          />
        ))}
      </div>

      <div className="calculator__points">
        Points: {availablePoints}
      </div>
    </div>
  )
}

(Calculator as any).whyDidYouRender = true