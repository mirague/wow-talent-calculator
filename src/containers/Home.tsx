import React from 'react'
import { Calculator } from '../components/Calculator'
import { ClassPicker } from '../components/ClassPicker'
import { match } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { decodeKnownTalents } from '../lib/tree'
import { classByName } from '../data/classes'

interface Props extends RouteComponentProps {
  match: match<{ 
    selectedClass: string
    pointString: string
  }>
}

export default class Home extends React.PureComponent<Props> {
  static whyDidYouRender = true

  componentDidMount() {
    const { selectedClass } = this.props.match.params
    if (selectedClass && !classByName[selectedClass]) {
      this.props.history.replace('/')
    }
  }

  render() {
    const { match, history } = this.props
    const { selectedClass, pointString } = match.params

    if (selectedClass && !classByName[selectedClass]) {
      return null
    }

    return (
      <div className="container index">
        <ClassPicker 
          className="index__class-picker"
          center 
          selected={selectedClass} 
        />
  
        {selectedClass && 
          <Calculator 
            initialTalents={pointString && decodeKnownTalents(pointString, selectedClass)}
            selectedClass={selectedClass} 
            history={history}
          />
        }
      </div>
    )
  }
}