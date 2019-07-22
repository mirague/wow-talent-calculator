import React, { FC } from 'react'
import classNames from 'classnames'
import './Icon.scss'

interface Props {
  name: string
  size?: 'small' | 'medium' | 'large'
  golden?: boolean
}

export const Icon: FC<Props> = ({ name, size = 'medium', golden = false, children }) => {
  const className = classNames(
    'icon', 
    `icon--${size}`, {
      'icon--golden': golden
    }
  )

  const bgSize = size === 'medium' ? 'large' : 'medium'
  const bgStyle = {
    backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/${bgSize}/${name}.jpg)`
  }

  return (
    <div className={className}>
      <div className="icon__bg" style={bgStyle} />
      <div className="icon__frame" />
      {children}
    </div>
  )
}