import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Lobby from './components/Lobby';
import MainPage from './components/MainPage';
import history from './utils/history';

const ENDPOINT = "http://127.0.0.1:8001/"

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
