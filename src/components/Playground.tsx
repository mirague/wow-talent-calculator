import './Playground.scss'
import React, { FC } from 'react'
import { ClassPicker } from './ClassPicker'
import { RouteComponentProps } from 'react-router'
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
import { TalentSlot } from './TalentSlot';
import { talentsById } from '../data/talents';

interface Props extends RouteComponentProps {
  //
}

const iconNames = [
  '',
  'this_doesnot_exist_and_will_cause_default_icon',
  'spell_holy_prayerofhealing',
  'ability_sap',
  'class_shaman',
  'inv_ammo_firetar',
  'spell_shadow_requiem',
]

const DEEP_WOUNDS = <Tooltip title="Deep Wounds" fixed>
  <p className="tight">Rank 1/3</p>
  <p className="yellow">Your critical strikes cause the opponent to bleed, dealing 20% of your melee weapon's average damage over 12 sec.</p>

  <p className="tight">Next rank:</p>
  <p className="yellow">Your critical strikes cause the opponent to bleed, dealing 40% of your melee weapon's average damage over 12 sec.</p>

  <p className="green">Click to learn</p>
</Tooltip>

const Section: FC<any> = (props) => {
  return <div className="playground-section">
    <div className="container">
      <h2>{props.title}</h2>

      {props.children}
    </div>
  </div>
}

export class Playground extends React.PureComponent<Props> {
  static whyDidYouRender = true

  render() {
    return (
      <div className="playground">
        <Section title="Class Picker">
          <ClassPicker />
        </Section>

        <Section title="Icons">
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
        </Section>

        <Section title="TalentSlot">
          <div className="inline-items">
            <TalentSlot
              talent={talentsById[181]}
              disabled
            />

            <TalentSlot
              talent={talentsById[181]}
            />

            <TalentSlot
              talent={talentsById[181]}
              points={3}
            />

            <TalentSlot
              talent={talentsById[181]}
              points={5}
            />

            <TalentSlot
              talent={talentsById[181]}
              points={3}
              disabled
            />
          </div>
        </Section>

        <Section title="Tooltips">
          <h3>No params</h3>
          <Tooltip />

          <h3>Simple text content</h3>
          <Tooltip children="Sanctuary Post" />

          <h3>Using HTML inside</h3>
          <Tooltip>
            <strong>I can use normal HTML in here</strong>
            <br />
            And even <a href="/warrior">link</a> to exciting places!
          </Tooltip>

          <h3>Fixed width</h3>
          {DEEP_WOUNDS}

          <h3>Overriding fixed width</h3>
          {React.cloneElement(DEEP_WOUNDS, {
            width: '500px'
          })}

          <h3>No fixed</h3>
          {React.cloneElement(DEEP_WOUNDS, {
            fixed: false
          })}
        </Section>
      </div>
    )
  }
}