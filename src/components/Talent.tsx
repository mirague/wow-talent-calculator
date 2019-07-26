import './Talent.scss'
import React from 'react'
import { Icon } from './Icon'
import classNames from 'classnames'
import { Controller, Trigger } from './Tooltip'
import { TalentTooltip } from './TalentTooltip'

interface Props {
  talent: TalentData
  specId?: number
  points?: number
  disabled?: boolean
  errors?: string
  onClick?: (talentId: number) => void
  onRightClick?: (talentId: number) => void
}

export class Talent extends React.PureComponent<Props> {
  static whyDidYouRender = true

  static defaultProps = {
    points: 0,
    disabled: false,
    onClick: () => undefined,
    onRightClick: () => undefined
  }

  render() {
    const { talent, points, errors, disabled } = this.props
    const showPoints = !disabled || points > 0
  
    const containerClassNames = classNames('talent', {
      'talent--disabled': disabled && points === 0,
      'talent--available': !disabled && points < talent.ranks.length,
      'talent--disabled-with-points': points >= talent.ranks.length || (points > 0 && disabled)
    })
  
    const pointsClassNames = classNames('point-label', {
      'point-label--enabled': !disabled
    })
  
    const handleContextMenu = (e) => {
      if (this.props.onRightClick) this.props.onRightClick(talent.id)
      e.preventDefault()
      return false
    }
  
    return (
      <Controller>
        <Trigger>
          <div 
            className={containerClassNames}
            data-row={talent.row}
            data-col={talent.col}
            onClick={!disabled ? () => this.props.onClick(talent.id) : () => {}}
            onContextMenu={handleContextMenu}
          >
            <div className="talent__status" />
            <Icon name={talent.icon} size="medium" />
  
            {showPoints &&
              <div className={pointsClassNames}>
                {points}/{talent.ranks.length}
              </div>
            }
          </div>
        </Trigger>
        
        <TalentTooltip talent={talent} points={points} errors={errors}>
          {!disabled && points < talent.ranks.length && <p className="green tight">Click to learn</p>}
          {points > 0 && <p className="green">Right-click to unlearn</p>}
        </TalentTooltip>
      </Controller>
    )
  }
}

// ;(Talent as any).whyDidYouRender = true