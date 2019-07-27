import './Icon.scss'
import React from 'react'
import classNames from 'classnames'

interface Props {
  name?: string
  size?: 'small' | 'medium' | 'large'
  golden?: boolean
  className?: string
}

const NOT_FOUND_ICON = 'inv_misc_questionmark'

const makeUrl = (name: string, size: string, useFallback = false): string => {
  if (useFallback) {
    return `https://wow.zamimg.com/images/wow/icons/${size}/${name}.jpg`
  }
  return `${process.env.PUBLIC_URL}/images/icons/${size}/${name}.jpg`
}

export class Icon extends React.PureComponent<Props> {
  static defaultProps = {
    size: 'medium',
    golden: false
  }

  img: HTMLImageElement = undefined

  state = {
    fadeIn: false,
    url: ''
  }

  componentDidMount() {
    this.loadImage(this.props.name)
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.name !== this.props.name) {
      this.loadImage(this.props.name)
    }
  }

  componentWillUnmount() {
    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img.src = '' 
    }
  }

  loadImage = (icon: string, useFallback = false): void => {
    this.setState({ url: '', fadeIn: false })
    const bgSize = this.props.size !== 'small' ? 'large' : 'medium'
    const url = icon && makeUrl(icon, bgSize, useFallback)
    if (!url) return

    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img.src = '' 
    }

    const start = Date.now()
    this.img = new Image()
    this.img.onload = () => {
      const loadTime = Date.now() - start
      this.setState({ url, fadeIn: loadTime >= 300 })
      this.img = undefined
    }
    this.img.onerror = () => {
      if (url.indexOf('wow.zamimg') === -1) {
        this.loadImage(icon, true)
      } else {
        this.loadImage(NOT_FOUND_ICON)
      }
    }
    this.img.src = url
  }

  render() {
    const { size, golden, className, ...rest } = this.props
    const { fadeIn, url } = this.state

    const cn = classNames('icon', `icon--${size}`, className, {
      'icon--golden': golden,
      'icon--loaded': !!url,
      'icon--fade-in': fadeIn,
    })
  
    return (
      <div className={cn} {...rest}>
        {url && 
          <div className="icon__bg" style={{ backgroundImage: `url(${url})` }} />
        }
        <div className="icon__frame" />
        {this.props.children}
      </div>
    )
  }
}