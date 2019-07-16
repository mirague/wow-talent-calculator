import React, { FC } from 'react'
import './TalentSlot.scss'
import { Icon } from './Icon'
import { spells } from '../data/spells'

interface Props {
  key: number
  talent: TalentData
  /** Points spent */
  points: number
  onClick?: (e: any) => void
}

export const TalentSlot: FC<Props> = (props) => {
  const { talent, points } = props
  const requiredPointsSpent = talent.row * 5

  return (
    <div 
      className="talent"
      title={talent.ranks[0].toString()}
      data-row={talent.row}
      data-col={talent.col}
      onClick={props.onClick}
    >
      <Icon name={talent.icon} />
      <div className="talent__rank">{points}/{talent.ranks.length}</div>
    </div>
  )
}