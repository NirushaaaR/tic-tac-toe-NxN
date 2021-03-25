import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Play from './components/Page/Play';
import UserProvider from './UserProvider';
import Login from './components/Page/Login';
import Replay from './components/Page/Replay';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/play" component={Play} />
            <Route exact path="/replay" component={Replay} />
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
