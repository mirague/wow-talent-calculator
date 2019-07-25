import React from 'react'
import './App.scss'
import { IndexRoute } from './components/IndexRoute'
import { Playground } from './components/Playground'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router>
    {/* <Router basename={process.env.NODE_ENV !== 'development' ? '%PUBLIC_URL%' : ''}> */}
      <div className="App">
        <Switch>
          <Route exact path="/playground" component={Playground} />
          <Route path="/:selectedClass?/:pointString?" component={IndexRoute} />
        </Switch>

        <footer>
          <Link to="/">Home</Link>
          {' - '}
          <Link to="/playground">Components</Link>
        </footer>
      </div>
    </Router>
  );
}

export default App;
