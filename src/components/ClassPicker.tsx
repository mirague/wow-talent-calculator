import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { classByName } from '../data/classes'
import { Icon } from './Icon'
import classNames from 'classnames'

interface Props {
  /** Name of the selected class, lowercase */
  selected?: string
}

const classNameForItem = (c: ClassData, selected: string) => classNames('class-picker__class', {
  'class-picker__class--active': c.name.toLowerCase() === selected,
  'class-picker__class--inactive': !!selected && c.name.toLowerCase() !== selected
})

export class ClassPicker extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    const { selected } = this.props

    const cn = classNames('class-picker', {
      'class-picker--has-selection': !!selected
    })
  
    return (
      <ul className={cn}>
      {Object.values(classByName).map((c) => 
        <li key={c.id} className={classNameForItem(c, selected)}>
          <Link to={`/${c.name.toLowerCase()}`} title={c.name}>
            <Icon name={c.icon} />
          </Link>
        </li>
      )}
    </ul>
    )
  }
}
