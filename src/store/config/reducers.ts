import {
  ConfigState, ConfigActionTypes
} from './types'

const initialState: ConfigState = {
  alwaysShowPoints: false
}

export default function(state = initialState, action: ConfigActionTypes): ConfigState {
  switch (action.type) {
    default: 
      return state
  }
}