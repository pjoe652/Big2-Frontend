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
      roomId: "",
      redirect: null,
      socket: null
    }
  }

  onUsernameChange = (e) => {
    this.setState({
      username: e.target.value,
      errored: false
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
            <Lobby />
          </Route>
          <Route path="/">
            <MainPage socket={this.state.socket} onUsernameChange={this.onUsernameChange} username={this.state.username}/>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default PageWrapper
