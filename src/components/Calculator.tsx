import React from 'react'
import { Map } from 'immutable'
import { TalentTree } from './TalentTree'
import { 
  modifyTalentPoint, 
  calcAvailablePoints,
  encodeKnownTalents
} from '../lib/tree'
import { talentsBySpec } from '../data/talents'
import { classByName } from '../data/classes'
import { History } from 'history'

interface Props {
  selectedClass: string
  history: History
}

// const EMPTY_TALENTS = Map<number, number>()
const EMPTY_TALENTS = Map<number, number>()
  // .set(30, 5)
  // .set(26, 5)
  // .set(34, 5)
  // .set(28, 2)
  // .set(27, 3)
  // .set(33, 1)
  // .set(29, 1)
  // .set(32, 1)

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
    const { selectedClass } = this.props
    const talent = talentsBySpec[specId][talentId]
    console.log('Clicked talent: ' + talentId)

    const newKnownTalents = modifyTalentPoint(this.state.knownTalents, talent, modifier)
    this.setState({ knownTalents: newKnownTalents })

    const pointString = encodeKnownTalents(newKnownTalents, selectedClass)
    this.props.history.replace(`/${selectedClass}/${pointString}`)
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

