import React from 'react'
import { ClassPicker } from './ClassPicker'
import { match } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

interface Props extends RouteComponentProps {
  match: match<{ 
    selectedClass: string
    pointString: string
  }>
}

const iconNames = [
  'foo',
  'spell_holy_prayerofhealing',
  'ability_sap',
  'class_shaman',
  'inv_ammo_firetar',
  'spell_shadow_requiem',
]

export class PlaygroundRoute extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    const { match, history } = this.props



    return (
      <div className="playground container">
        <h2>Class Picker</h2>
        <ClassPicker />

        <h2>Icons</h2>

        <h3>Small Icons</h3>
        <div className="inline-items">
          {iconNames.map((n) => <Icon key={n} name={n} size="small" />)}
        </div>

        <h3>Medium Icons</h3>
        <div className="inline-items">
          {iconNames.map((n) => <Icon key={n} name={n} size="medium" />)}
        </div>

        <h3>Large Icons</h3>
        <div className="inline-items">
          {iconNames.map((n) => <Icon key={n} name={n} size="large" />)}
        </div>

        <h2>Tooltip</h2>
        <Tooltip inline />

        <Tooltip>
          <strong>I can use normal HTML in here</strong>
          <br />
          And even <a href="#">link</a> to exciting places!
        </Tooltip>

        <Tooltip title="Sanctuary Post" />

        <Tooltip title="Fixed width" fixed />

        <Tooltip title="Override fixed width" fixed width="600px" />
      </div>
    )
  }
}