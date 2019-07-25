import React, { FC } from 'react'
import { Tooltip } from './Tooltip'
import spells from '../data/spells.json'

interface Props {
  id: number
}

export const SpellTooltip: FC<Props> = ({ id }) => {
  const spell: SpellData = spells[id.toString()]
  if (!spell) {
    return <Tooltip fixed>Spell not found :(</Tooltip>
  }

  return <Tooltip fixed title={spell.name} icon={spell.icon}>
    {spell.rank && 
      <p className="tight">Rank {spell.rank}</p>
    }
    <p className="yellow">{spell.description}</p>
  </Tooltip>
}