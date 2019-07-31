import './Calculator.scss'
import React from 'react'
import { Map } from 'immutable'
import TalentTree from './TalentTree'
import { calcAvailablePoints } from '../lib/tree'
import { classById } from '../data/classes'
import { connect } from 'react-redux';
import { addPoint, removePoint } from '../store/calculator/actions'
import { Points } from '../store/calculator/types'

interface Props {
  classId: number
  points: Points
  addPoint: typeof addPoint
  removePoint: typeof removePoint
}

const EMPTY_TALENTS = Map<number, number>()

export class Calculator extends React.PureComponent<Props> {
  static whyDidYouRender = true

  state = {
    knownTalents: EMPTY_TALENTS
  }

  handleTalentPress = (specId: number, talentId: number, modifier: 1 | -1) => {
    if (modifier === 1) {
      this.props.addPoint(talentId)
    } else {
      this.props.removePoint(talentId)
    }
  }

  render() {
    const { classId } = this.props
    const knownTalents = this.props.points

    const classData = classById[classId]
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
          {availablePoints < 51 && 
            <span className="subtle">Required level: {60 - availablePoints}</span>
          }
          <span>Talent points: {availablePoints}</span>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  {
    addPoint,
    removePoint
  }
)(Calculator)