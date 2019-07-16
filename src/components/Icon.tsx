import React, { FC } from 'react'
import './Icon.scss'

interface Props {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export const Icon: FC<Props> = ({ name, size = 'medium', children }) => {
  const url = `https://wow.zamimg.com/images/wow/icons/${size}/${name}.jpg`
  const className = `icon icon--${size}`

  return (
    <div className={className} style={{ backgroundImage: `url(${url})`}}>
      {children}
    </div>
  )
}