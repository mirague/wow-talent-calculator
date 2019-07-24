import './Tooltip.scss'
import React, { FC } from 'react'
import classNames from 'classnames'

interface Props {
  title?: string
  /** Override width of tooltip. Needs `fixed` to be true to have effect. */
  width?: string
  /** Fixed width */
  fixed?: boolean
  /** Display tooltip inline */
  inline?: boolean
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

  return <div className={cn} style={style}>
    <div className="tooltip__inner">
      <div className="tooltip__top">
        <div className="tooltip__body">
          {title}
          {children}
        </div>
      </div>

      <div className="tooltip__footer" />
    </div>
  </div>
}