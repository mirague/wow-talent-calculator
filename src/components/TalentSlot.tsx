import './TalentSlot.scss'
import React, { FC } from 'react'
import { Icon } from './Icon'
import classNames from 'classnames'

interface Props {
  talent: TalentData
  specId?: number
  points?: number
  disabled?: boolean
  onClick?: (talentId: number) => void
  onRightClick?: (talentId: number) => void
}

const defaultProps: Partial<Props> = {
  points: 0,
  disabled: false,
  onClick: () => undefined,
  onRightClick: () => undefined
}

export const TalentSlot: FC<Props> = (props) => {
  const { talent, points, disabled } = props
  const showPoints = !disabled || points > 0

  const containerClassNames = classNames('talent', {
    'talent--disabled': disabled && points === 0,
    'talent--available': !disabled && points < talent.ranks.length,
    'talent--maxed': points >= talent.ranks.length || (points > 0 && disabled)
  })

  const pointsClassNames = classNames('point-label', {
    'point-label--enabled': !disabled
  })

  const handleContextMenu = (e) => {
    if (props.onRightClick) props.onRightClick(talent.id)
    e.preventDefault()
    return false
  }

  return (
    <div 
      className={containerClassNames}
      title={talent.ranks[0].toString()}
      data-row={talent.row}
      data-col={talent.col}
      onClick={!disabled ? () => props.onClick(talent.id) : () => {}}
      onContextMenu={handleContextMenu}
    >
      <div className="talent__status" />
      <Icon name={talent.icon} size="medium" />

      {showPoints &&
        <div className={pointsClassNames}>
          {points}
          /{talent.ranks.length}
        </div>
      }
    </div>
  )
}

TalentSlot.defaultProps = defaultProps

;(TalentSlot as any).whyDidYouRender = true