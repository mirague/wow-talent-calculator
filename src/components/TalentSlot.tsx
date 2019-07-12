import React from 'react'
import './TalentSlot.scss'

interface Props {
  key: number
  talent: Talent
  /** Points spent */
  points: number
  onClick?: (e: any) => void
}

export const TalentSlot: React.FC<Props> = (props) => {
  const { talent, points } = props
  const requiredPointsSpent = talent.row * 5

  return (
    <div 
      className="talent"
      title={talent.name}
      data-row={talent.row}
      data-col={talent.column}
      onClick={props.onClick}
    >
      <small>{talent.name}</small>
      <div className="talent__rank">{points}/{talent.ranks.length}</div>
    </div>
  )
}