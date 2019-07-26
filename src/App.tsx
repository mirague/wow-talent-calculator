import React from 'react'
import './App.scss'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Loadable from 'react-loadable'
import { PageLoader } from './components/PageLoader'

const LoadableHome = Loadable({
  loader: () => import('./containers/Home'),
  loading: PageLoader
})

const LoadablePlayground = Loadable({
  loader: () => import('./containers/Playground'),
  loading: PageLoader
})

const App: React.FC = () => {
  return (
    <Router>
    {/* <Router basename={process.env.NODE_ENV !== 'development' ? '%PUBLIC_URL%' : ''}> */}
      <div className="App">
        <main>
          <Switch>
            <Route exact path="/playground" component={LoadablePlayground} />
            <Route path="/:selectedClass?/:pointString?" component={LoadableHome} />
          </Switch>
        </main>

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
