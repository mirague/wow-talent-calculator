import React from 'react'
import { Calculator } from './Calculator'
import { Link } from 'react-router-dom';

interface Props {
  pointString?: string // e.g. 2305302300--001
  match: any
  history: any
}

const ClassPicker = () => {
  return <ul>
    <li><Link to="/warlock">Warlock</Link></li>
    <li><Link to="/paladin">Paladin</Link></li>
  </ul>
}

export const IndexRoute: React.FC<Props> = ({ match, history }) => {
  const { selectedClass, pointString } = match.params
  
  if (!selectedClass) {
    history.replace('/warlock')
    return null
  }

  return (
    <div className="index">
      <ClassPicker />

      {selectedClass && 
        <Calculator selectedClass={selectedClass} />
      }
    </div>
  )
}