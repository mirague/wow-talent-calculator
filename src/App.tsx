import React from 'react'
import './App.scss'
import { IndexRoute } from './components/IndexRoute'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Route path="/:selectedClass?/:points?" component={IndexRoute} />
      </div>
    </Router>
  );
}

export default App;
