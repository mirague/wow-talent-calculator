import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import './Icon.scss'

interface Props {
  name?: string
  size?: 'small' | 'medium' | 'large'
  golden?: boolean
  className?: string
}

const NOT_FOUND_ICON = 'inv_misc_questionmark'

export const Icon = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { name: defaultName, size = 'medium', golden = false, children, ...rest } = props
  const [hasLoadedImage, setLoadedImage] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [name, setName] = useState(defaultName)

  const bgSize = size !== 'small' ? 'large' : 'medium'
  const url = name && iconUrl(name, bgSize)

  const start = Date.now()

  useEffect(() => {
    if (!url) return
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
  }, [url, start])

  const className = classNames('icon', `icon--${size}`, props.className, {
    'icon--golden': golden,
    'icon--loaded': hasLoadedImage,
    'icon--fade-in': fadeIn,
  })

  return (
    <div className={className} ref={ref} {...rest}>
      {url && 
        <div className="icon__bg" style={{ backgroundImage: `url(${url})` }} />
      }
      <div className="icon__frame" />
      {children}
    </div>
  )
})

const iconUrl = (name: string, size: string): string => {
  if (name === NOT_FOUND_ICON) {
    return require(`../images/icons/${size}/${name}.jpg`)
  }
  return `https://wow.zamimg.com/images/wow/icons/${size}/${name}.jpg`
}