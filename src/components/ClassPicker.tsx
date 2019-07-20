import React from 'react'
import { NavLink } from 'react-router-dom'
import { classByName } from '../data/classes'

interface Props {
}

export const ClassPicker: React.FC<Props> = () => {
  return (
    <ul className="class-picker">
      {Object.values(classByName).map((c) => 
        <li key={c.id} className="class-picker__class">
          <NavLink to={`/${c.name.toLowerCase()}`}>{c.name}</NavLink>
        </li>
      )}
    </ul>
  )
}