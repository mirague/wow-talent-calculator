import React, { FC, useState, useEffect } from 'react'
import classNames from 'classnames'
import './Icon.scss'

interface Props {
  name?: string
  size?: 'small' | 'medium' | 'large'
  golden?: boolean
}

const NOT_FOUND_ICON = 'inv_misc_questionmark'

export const Icon: FC<Props> = ({ name: defaultName, size = 'medium', golden = false, children }) => {
  const [hasLoadedImage, setLoadedImage] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [name, setName] = useState(defaultName)

  const bgSize = size !== 'small' ? 'large' : 'medium'
  const url = `https://wow.zamimg.com/images/wow/icons/${bgSize}/${name}.jpg`

  const start = Date.now()

  useEffect(() => {
    if (!name) return
    const img = new Image()
    img.onload = () => {
      const loadTime = Date.now() - start
      if (loadTime >= 300) {
        setFadeIn(true)
      }
      setLoadedImage(true)
    }
    img.onerror = () => setName(NOT_FOUND_ICON)
    img.src = url
  }, [name, url, start])

  const className = classNames('icon', `icon--${size}`, {
    'icon--golden': golden,
    'icon--loaded': hasLoadedImage,
    'icon--fade-in': fadeIn,
  })

  return (
    <div className={className}>
      {name && 
        <div className="icon__bg" style={{ backgroundImage: `url(${url})` }} />
      }
      <div className="icon__frame" />
      {children}
    </div>
  )
}