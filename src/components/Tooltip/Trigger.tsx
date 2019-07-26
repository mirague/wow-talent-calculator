import React from 'react'
import ReactDOM from 'react-dom'
import { debounce } from '../../lib/helpers'

interface Props {
  resize?: (rect: { left: number, top: number, width: number, height: number }) => void
  children: React.ReactElement
}

export class Trigger extends React.PureComponent<Props> {
  trigger = React.createRef<HTMLElement>()

  get boundingRect() {
    if (!this.trigger.current) {
      throw new Error('Trigger does not have reference to itself')
    }
    const { width, height, top, left } = (ReactDOM.findDOMNode(this.trigger.current) as HTMLElement).getBoundingClientRect()
    return { width, height, top, left }
  }

  resize = debounce(() => this.props.resize(this.boundingRect), 250)

  componentDidMount() {
    this.resize()
    window.addEventListener('scroll', this.resize)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.resize)
    window.removeEventListener('resize', this.resize)
  }

  componentDidUpdate() {
    this.resize()
  }

  render() {
    const { resize, children, ...props } = this.props
    return React.cloneElement(children, {
      ...props,
      ref: this.trigger
    })
  }
}
