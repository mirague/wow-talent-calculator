import React from 'react'
import { Map } from 'immutable'
import { TalentTree } from './TalentTree'
import { 
  modifyTalentPoint, 
  calcAvailablePoints
} from '../lib/tree'
import { talentsBySpec } from '../data/talents'
import { classByName } from '../data/classes'

interface Props {
  selectedClass: string
}

const EMPTY_TALENTS = Map<number, number>()

export class Calculator extends React.PureComponent<Props> {
  static whyDidYouRender = true

  state = {
    knownTalents: EMPTY_TALENTS
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedClass !== this.props.selectedClass) {
      this.setState({ 
        knownTalents: EMPTY_TALENTS 
      })
    }
  }
  
  handleTalentPress = (specId: number, talentId: number, modifier: 1 | -1) => {
    const talent = talentsBySpec[specId][talentId]
    this.setState({ 
      knownTalents: modifyTalentPoint(this.state.knownTalents, talent, modifier)
    })
  }

  render() {
    const { selectedClass } = this.props
    const { knownTalents } = this.state

    const classData = classByName[selectedClass]
    const availablePoints = calcAvailablePoints(knownTalents)

    return (
      <div className="calculator">
        <div className="trees">
          {classData.specs.map((specId) => (
            <TalentTree
              key={specId}
              specId={specId}
              availablePoints={availablePoints}
              knownTalents={knownTalents}
              onTalentPress={this.handleTalentPress}
            />
          ))}
        </div>

        <div className="calculator__points">
          Points: {availablePoints}
        </div>
      </div>
    )
  }
}

