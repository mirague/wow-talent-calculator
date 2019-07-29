import { createStore, combineReducers, compose } from 'redux'
import calculator from './calculator/reducers'

const rootReducer = combineReducers({
  calculator, 
})

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(
  rootReducer,
  compose(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  ),
)

export default store
