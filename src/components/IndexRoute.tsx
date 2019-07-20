import React from 'react'
import { Calculator } from './Calculator'
import { ClassPicker } from './ClassPicker'

interface Props {
  pointString?: string // e.g. 2305302300--001
  match: any
  history: any
}

export class IndexRoute extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    const { match, history } = this.props
    const { selectedClass, pointString } = match.params
  
    if (!selectedClass) {
      history.replace('/warlock')
      return null
    }
  
    return (
      <div className="index">
        <ClassPicker />
  
        {selectedClass && 
          <Calculator 
            selectedClass={selectedClass}
          />
        }
      </div>
    )
  }
}