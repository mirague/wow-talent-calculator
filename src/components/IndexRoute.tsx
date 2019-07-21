import React from 'react'
import { Calculator } from './Calculator'
import { ClassPicker } from './ClassPicker'
import { match } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'

interface Props extends RouteComponentProps {
  match: match<{ 
    selectedClass: string
    pointString: string
  }>
}

export class IndexRoute extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    const { match } = this.props
    const { selectedClass, pointString } = match.params
  
    return (
      <div className="index">
        <ClassPicker selected={selectedClass} />
  
        {selectedClass && 
          <Calculator selectedClass={selectedClass} />
        }
      </div>
    )
  }
}