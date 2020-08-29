import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client'
import MainPage from './components/MainPage';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

const ENDPOINT = "http://127.0.0.1:8001/"

// class PageWrapper extends React.Component {
  // constructor() {
  //   super()
  // }
  function PageWrapper() {

  // componentDidMount = () => {
    const [ response, setResponse ] = useState("")

    useEffect(() => {
      const socket = socketIOClient(ENDPOINT)
      socket.emit("create player", "Tester")
      socket.on("create player", response => {
        console.log(response)
      })
    }, [])
  // }

  // render() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </Router>
    )
  // }
}

export default PageWrapper;
