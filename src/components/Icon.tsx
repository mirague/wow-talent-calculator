import React, { FC, useState, useEffect } from 'react'
import classNames from 'classnames'
import './Icon.scss'

interface Props {
  name: string
  size?: 'small' | 'medium' | 'large'
  golden?: boolean
}

export const Icon: FC<Props> = ({ name, size = 'medium', golden = false, children }) => {
  const [hasLoadedImage, setHasLoadedImage] = useState(false)

  const bgSize = size === 'medium' ? 'large' : 'medium'
  const url = `https://wow.zamimg.com/images/wow/icons/${bgSize}/${name}.jpg`

  useEffect(() => {
    const img = new Image()
    img.onload = () => setHasLoadedImage(true)
    img.src = url
  }, [])

  const className = classNames('icon', `icon--${size}`, {
    'icon--golden': golden,
    'icon--loading': !hasLoadedImage
  })

  return (
    <div className={className}>
      <div className="icon__bg" style={{ backgroundImage: `url(${url})` }} />
      <div className="icon__frame" />
      {children}
    </div>
  )
}