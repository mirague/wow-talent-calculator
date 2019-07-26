import './ClassPicker.scss'
import React from 'react'
import { Link } from 'react-router-dom'
import { classByName } from '../data/classes'
import { Icon } from './Icon'
import classNames from 'classnames'
import { Controller, Trigger, Tooltip } from './Tooltip';

interface Props {
  /** Name of the selected class, lowercase */
  selected?: string
  center?: boolean
  className?: string
}

const classNameForItem = (c: ClassData, selected: string) => classNames('class-picker__class', {
  'class-picker__class--active': c.name.toLowerCase() === selected,
  'class-picker__class--inactive': !!selected && c.name.toLowerCase() !== selected
})

export class ClassPicker extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    const { selected, center = false } = this.props

    const cn = classNames('class-picker', {
      'class-picker--has-selection': !!selected,
      'class-picker--center': center,
    }, this.props.className)
  
    return (
      <ul className={cn}>
      {Object.values(classByName).map((c) => 
        <li key={c.id} className={classNameForItem(c, selected)}>        
          <Controller>
            <Trigger>
              <Link to={`/${c.name.toLowerCase()}`}>
                <Icon 
                  name={c.icon} 
                  golden={selected === c.name.toLowerCase()}
                />
              </Link>
            </Trigger>
            <Tooltip>{c.name}</Tooltip>
          </Controller>
        </li>
      )}
    </ul>
    )
  }
}
