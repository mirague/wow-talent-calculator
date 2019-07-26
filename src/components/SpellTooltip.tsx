import React from 'react'
import { Tooltip, Props as BaseProps } from './Tooltip'
import spells from '../data/spells.json'

interface Props extends BaseProps {
  id: number
}

export class SpellTooltip extends React.PureComponent<Props> {
  render() {
    const spell: SpellData = spells[this.props.id.toString()]
    if (!spell) {
      return <Tooltip fixed {...this.props}>Spell not found :(</Tooltip>
    }
  
    return <Tooltip fixed title={spell.name} icon={spell.icon} {...this.props}>
      {spell.rank && 
        <p className="tight">Rank {spell.rank}</p>
      }
      <p className="yellow">{spell.description}</p>
    </Tooltip>
  }
}