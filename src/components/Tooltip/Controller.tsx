import React from 'react'
import ReactDOM from 'react-dom'
import { createPortal } from 'react-dom'
import { Map } from 'immutable'
import { Trigger } from './Trigger';

const TOOLTIP_ROOT = document.getElementById('tooltip-root')

interface Props {
  position?: TooltipPosition
}

export class Controller extends React.PureComponent<Props> {
  static defaultProps = {
    position: 'top-right'
  }

  tooltip = React.createRef<HTMLSpanElement>()
  trigger = React.createRef<React.ReactInstance>()

  state = {
    isVisible: false,
    tooltipDimensions: Map({
      width: 0,
      height: 0
    }),
    style: Map({
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      opacity: 0,
    }),
    triggerRect: Map({
      left: 0,
      top: 0,
      width: 0,
      height: 0
    })
  }

  handleMouseEnter = () => {
    // TODO: cache this even for url transition (?), it's "expensive" and triggers reflow
    const { width, height, top, left } = (ReactDOM.findDOMNode(this.trigger.current) as HTMLElement).getBoundingClientRect()

    this.setState({ 
      isVisible: true,
      triggerRect: this.state.triggerRect.merge({ width, height, top, left })
    })
  }

  handleMouseLeave = () => {
    this.setState({ isVisible: false })
  }

  componentDidUpdate() {
    if (this.state.isVisible) {
      const { width, height } = (ReactDOM.findDOMNode(this.tooltip.current) as HTMLElement).getBoundingClientRect()
      const { style, tooltipDimensions } = this.state

      const newTooltipDimensions = tooltipDimensions.merge({ width, height })
      this.setState({
        tooltipDimensions: newTooltipDimensions,
        style: style.merge({ ...this.getPosition(newTooltipDimensions) })
      })
    }
  }

  getPosition = (tooltipDimensions = this.state.tooltipDimensions): { top: number, left: number } => {
    return calculatePosition(this.props.position, this.state.triggerRect, tooltipDimensions)
  }

  updateTriggerRect = (triggerRect: { left: number, top: number, width: number, height: number }) => {
    this.setState({
      triggerRect: this.state.triggerRect.merge(triggerRect),
      style: this.state.style.set('opacity', 1)
    })
  }

  render() {
    const { children } = this.props
    const { isVisible, style } = this.state

    return React.Children.map(children, (child: React.ReactElement) => {
      if (child.type === Trigger) {
        return React.cloneElement(child, {
          ref: this.trigger,
          resize: this.updateTriggerRect,
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
        })
      } else {
        // Tooltip
        return isVisible && createPortal(
          <span style={style.toJS()} ref={this.tooltip}>
            {React.cloneElement(child)}
          </span>, 
          TOOLTIP_ROOT
        )
      }
    })
  }
}

const TOOLTIP_BOUNDING_PADDING = 10

const calculatePosition = (pos: TooltipPosition, trigger: Map<string, number>, tooltip: Map<string, number>) => {
  const { innerWidth: windowWidth } = window
  let top = 0
  let left = 0

  const triggerTop = trigger.get('top') + window.pageYOffset
  const triggerLeft = trigger.get('left') + window.pageXOffset

  // Top
  switch (pos) {
    case 'top-left': 
    case 'top-right': {
      top = triggerTop - (tooltip.get('height') + 5)
      break
    }

    case 'bottom-left':
    case 'bottom-right': {
      top = triggerTop + trigger.get('height') + 5
      break
    }
  }

  // Left
  switch (pos) {
    case 'left':
    case 'bottom-left':
    case 'top-left': {
      left = triggerLeft - tooltip.get('width')
      break
    }

    case 'right': 
    case 'bottom-right':
    case 'top-right': {
      left = triggerLeft + trigger.get('width')
      break
    }
  }

  const overflowsRight = left + tooltip.get('width') + TOOLTIP_BOUNDING_PADDING > windowWidth
  const overflowsTop = top - (window.scrollY + TOOLTIP_BOUNDING_PADDING) < 0

  // Validate
  switch (pos) {
    case 'top-right': {
      if (overflowsRight && !overflowsTop) return calculatePosition('top-left', trigger, tooltip)
      if (!overflowsRight && overflowsTop) return calculatePosition('bottom-right', trigger, tooltip)
      if (overflowsRight && overflowsTop) return calculatePosition('bottom-left', trigger, tooltip)
      break
    }

    case 'top-left': {
      break
    }
  }

  return { top, left }
}
