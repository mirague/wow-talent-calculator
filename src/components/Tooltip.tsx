import './Tooltip.scss'
import React, { FC } from 'react'
import classNames from 'classnames'
import { Icon } from './Icon'

interface Props {
  title?: string
  /** Override width of tooltip. Needs `fixed` to be true to have effect. */
  width?: string
  /** Fixed width */
  fixed?: boolean
  /** Display tooltip inline */
  inline?: boolean
  /** Icon to show next to tooltip */
  icon?: string
}

export const Tooltip: FC<Props> = (props) => {
  const { title, children } = props

  const cn = classNames('tooltip', {
    'tooltip--fixed': props.fixed,
    'tooltip--inline': props.inline,
  })
  
  const style = {
    width: props.width
  }

  return <div className={cn}>
    {props.icon && 
      <Icon className="tooltip__icon" name={props.icon} />
    }
    <div className="tooltip__inner" style={style}>
      <div className="tooltip__top">
        <div className="tooltip__body">
          {title && <div className="tooltip__title tight">{title}</div>}
          {children}
        </div>
      </div>

      <div className="tooltip__footer" />
    </div>
  </div>
}