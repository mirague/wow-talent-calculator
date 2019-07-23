import React from 'react'
import './App.scss'
import { IndexRoute } from './components/IndexRoute'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router basename={process.env.NODE_ENV !== 'development' ? '%PUBLIC_URL%' : ''}>
      <div className="App">
        <Route path="/:selectedClass?/:pointString?" component={IndexRoute} />
      </div>
    </Router>
  );
}

export default App;
