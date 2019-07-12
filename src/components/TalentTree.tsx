import React from 'react'
import { List }  from 'immutable'
import { TalentSlot } from './TalentSlot';

interface Props {
  tree: TalentTree
  spentPoints: List<number>
  onTalentPress: TalentClickHandler
}

export const TalentTree: React.FC<Props> = ({ tree, spentPoints, onTalentPress }) => {
  const { talents } = tree

  const handleTalentPress = (index) => {
    return (e) => {
      onTalentPress(index, 'add')
    }
  }

  return (
    <div className="tree">
      <h2>{tree.name}</h2>
      {talents.map((talent, index) => 
        <TalentSlot 
          key={index}
          talent={talent}
          points={spentPoints.get(index, 0)}
          onClick={handleTalentPress(index)}
        />
      )}
    </div>
  )
}