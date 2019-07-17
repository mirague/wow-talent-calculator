import './TalentSlot.scss'
import React, { FC } from 'react'
import { Icon } from './Icon'
import classNames from 'classnames'
import { spells } from '../data/spells'
import { Map } from 'immutable';
import { getPointsInSpec, calcMeetsRequirements } from '../lib/tree';

interface Props {
  talent: TalentData
  specId: number
  availablePoints: number
  /** All spent talents */
  knownTalents: Map<number, number>
  /** Disabled override */
  disabled?: boolean
  onClick?: (e: any) => void
  onRightClick?: (e: any) => void
}

const isAvailable = (talent: TalentData, specId: number, knownTalents: Map<number, number>): boolean => {
  // Dependent on other talents?
  if (!calcMeetsRequirements(talent, knownTalents)) {
    return false
  }
  const pointsInSpec = getPointsInSpec(specId, knownTalents)
  return talent.row * 5 <= pointsInSpec
}

export const TalentSlot: FC<Props> = (props) => {
  const { talent, specId, knownTalents, availablePoints } = props
  const points = knownTalents.get(talent.id, 0)
  const showPoints = points > 0 || availablePoints > 0
  const disabled = false // props.disabled || !showPoints || !isAvailable(talent, specId, knownTalents)

  const cn = classNames('talent', {
    'talent--disabled': !!disabled,
    'talent--maxed': points >= talent.ranks.length
  })

  const handleContextMenu = (e) => {
    if (props.onRightClick) props.onRightClick(e)
    e.preventDefault()
    return false
  }

  return (
    <div 
      className={cn}
      title={talent.ranks[0].toString()}
      data-row={talent.row}
      data-col={talent.col}
      onClick={!disabled ? props.onClick : () => {}}
      onContextMenu={handleContextMenu}
    >
      <Icon name={talent.icon} />

      {showPoints && 
        <div className="talent__points">{points}/{talent.ranks.length}</div>
      }
    </div>
  )
}

(TalentSlot as any).whyDidYouRender = true