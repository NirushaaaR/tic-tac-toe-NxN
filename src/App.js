import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Board from './components/Board';
import UserProvider from './UserProvider';
import Login from './components/Login';

function App() {
  return (
    <UserProvider>
      <Router>
      <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/board">
            <Board />
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
