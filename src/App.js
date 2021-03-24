import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Board from './components/Board';
import UserProvider from './UserProvider';
import Login from './components/Login';
import Replay from './components/Replay';

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route exact path="/board" component={Board}/>
            <Route exact path="/replay" component={Replay} />
          </Switch>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
