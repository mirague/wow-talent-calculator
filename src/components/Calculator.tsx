import React, { useState, useCallback, useEffect } from 'react'
import { Map } from 'immutable'
import { TalentTree } from './TalentTree'
import { 
  modifyTalentPoint, 
  calcAvailablePoints
} from '../lib/tree'
import { talentsBySpec } from '../data/talents'
import { classByName } from '../data/classes'

interface Props {
  selectedClass: string
}

const initMap = Map<number, number>()

// TODO: Wrap in "IndexRoute" or something similar to take care of the url params
//       Calculator doesn't need to know about URL params

export const Calculator: React.FC<Props> = ({ selectedClass }) => {
  const [knownTalents, setKnownTalents] = useState(initMap)

  const handleTalentPress = useCallback((specId: number, talentId: number, modifier: 1 | -1) => {
    const talent = talentsBySpec[specId][talentId]
    setKnownTalents(knownTalents =>
      modifyTalentPoint(knownTalents, talent, modifier)
    )
  }, [])

  // Reset known talents when switching class
  useEffect(() => {
    setKnownTalents(initMap)
  }, [selectedClass])

  const classData = classByName[selectedClass]
  const availablePoints = calcAvailablePoints(knownTalents)

  return (
    <div className="calculator">
      <div className="trees">
        {classData.specs.map((specId) => (
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