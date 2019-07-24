import React from 'react'
import './App.scss'
import { IndexRoute } from './components/IndexRoute'
import { PlaygroundRoute } from './components/PlaygroundRoute'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/wow-talent-calculator' : ''}>
    {/* <Router basename={process.env.NODE_ENV !== 'development' ? '%PUBLIC_URL%' : ''}> */}
      <div className="App">
        <Switch>
          <Route exact path="/playground" component={PlaygroundRoute} />
          <Route path="/:selectedClass?/:pointString?" component={IndexRoute} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
