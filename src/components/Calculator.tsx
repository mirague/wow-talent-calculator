import React from 'react'
import { Map } from 'immutable'
import { TalentTree } from './TalentTree'
import { 
  modifyTalentPoint, 
  calcAvailablePoints,
  encodeKnownTalents,
} from '../lib/tree'
import { talentsBySpec } from '../data/talents'
import { classByName } from '../data/classes'
import { History } from 'history'
import { debugPrintKnown } from '../lib/debug'
import { Link } from 'react-router-dom';

interface Props {
  selectedClass: string
  history: History
  initialTalents?: Map<number, number>
}

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

  componentDidMount() {
    if (this.props.initialTalents) {
      this.setState({ knownTalents: this.props.initialTalents })
      this.updateURL(this.props.initialTalents)
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedClass !== this.props.selectedClass) {
      this.setState({ 
        knownTalents: EMPTY_TALENTS 
      })
    }
  }

  updateURL(knownTalents: Map<number, number>) {
    const { selectedClass } = this.props
    const pointString = encodeKnownTalents(knownTalents, selectedClass)
    this.props.history.replace(`/${selectedClass}` + (pointString ? `/${pointString}` : ''))
  }
  
  handleTalentPress = (specId: number, talentId: number, modifier: 1 | -1) => {
    const talent = talentsBySpec[specId][talentId]
    console.log('Clicked talent: ', talentId)

    const newKnownTalents = modifyTalentPoint(this.state.knownTalents, talent, modifier)
    if (newKnownTalents !== this.state.knownTalents) {
      this.updateURL(newKnownTalents)
    }
    this.setState({ knownTalents: newKnownTalents })

    // Debug
    debugPrintKnown(newKnownTalents)
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

        <h4>Quick links</h4>
        <ul>
          <li><Link to="/shaman/-5505000055523051-55">Shaman test</Link></li>
          <li><Link to="/shaman/-5595000055523051-55">Shaman test broken</Link></li>
          <li><Link to="/rogue/325323125551351-3253552122555155231-55225313333212151">Full Rogue (shouldn't be possible)</Link></li>
        </ul>
      </div>
    )
  }
}

