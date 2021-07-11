import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import GameRoom from './components/GameRoom';
import Lobby from './components/Lobby';
import MainPage from './components/MainPage';
import history from './utils/history';

const ENDPOINT = "http://127.0.0.1:8001/"
const testHand = [{"suit":"C","number":"5"},{"suit":"C","number":"A"},{"suit":"H","number":"5"},{"suit":"C","number":"7"},{"suit":"C","number":"9"},{"suit":"C","number":"6"},{"suit":"S","number":"8"},{"suit":"D","number":"8"},{"suit":"C","number":"4"},{"suit":"D","number":"4"},{"suit":"H","number":"6"},{"suit":"C","number":"Q"},{"suit":"S","number":"6"},{"suit":"D","number":"A"},{"suit":"H","number":"2"},{"suit":"D","number":"3"},{"suit":"S","number":"Q"},{"suit":"D","number":"6"},{"suit":"H","number":"8"},{"suit":"D","number":"10"},{"suit":"C","number":"2"},{"suit":"S","number":"5"},{"suit":"D","number":"9"},{"suit":"C","number":"K"},{"suit":"S","number":"7"},{"suit":"D","number":"K"}]

class PageWrapper extends React.Component {
  constructor() {
    super()

    this.state = {
      username: "",
      socket: null,
      currentPlayers: null
    }
  }

  onUsernameChange = (e) => {
    this.setState({
      username: e.target.value,
      errored: false
    })
  }

  setPlayers = (players) => {
    this.setState({
      currentPlayers: players
    })
  }

  componentDidMount() {
    this.setState({
      socket: socketIOClient(ENDPOINT)
    })
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/lobby/:roomID" username={this.state.username}>
            <Lobby socket={this.state.socket} username={this.state.username} currentPlayers={this.state.currentPlayers}/>
          </Route>'
          <Route path="/testRoom">
            <GameRoom hand={testHand} players={["Me", "Opponent 1", "two", "three"]}/>
          </Route>
          <Route path="/">
            <MainPage socket={this.state.socket} onUsernameChange={this.onUsernameChange} username={this.state.username} setPlayers={this.setPlayers}/>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default PageWrapper
