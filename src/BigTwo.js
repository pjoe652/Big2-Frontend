import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, BrowserRouter as Router } from 'react-router-dom';
import GameRoom from './components/GameRoom';
import Lobby from './components/Lobby';
import MainPage from './components/MainPage';
import { addPlayers, setGameRoomID, setRoute, setUsername } from './store/actions/game';
import history from './utils/history';
// import { useRouter } from './utils/useRouter';

const testHand = [{"suit":"C","number":"5"},{"suit":"C","number":"A"},{"suit":"H","number":"5"},{"suit":"C","number":"7"},{"suit":"C","number":"9"},{"suit":"C","number":"6"},{"suit":"S","number":"8"},{"suit":"D","number":"8"},{"suit":"C","number":"4"},{"suit":"D","number":"4"},{"suit":"H","number":"6"},{"suit":"C","number":"Q"},{"suit":"S","number":"6"},{"suit":"D","number":"A"},{"suit":"H","number":"2"},{"suit":"D","number":"3"},{"suit":"S","number":"Q"},{"suit":"D","number":"6"},{"suit":"H","number":"8"},{"suit":"D","number":"10"},{"suit":"C","number":"2"},{"suit":"S","number":"5"},{"suit":"D","number":"9"},{"suit":"C","number":"K"},{"suit":"S","number":"7"},{"suit":"D","number":"K"}]

export default function BigTwo() {
  const socket = useSelector(state => state.game.socket)
  const roomID = useSelector(state => state.game.roomID)
  const username = useSelector(state => state.game.username)
  const route = useSelector(state => state.game.route)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    socket.on("create room", res => {
      if (res) {
        console.log(res)
        dispatch(setGameRoomID(res.code))
        dispatch(addPlayers(res.room))
        dispatch(setRoute(`/lobby/${res.code}`))
      }
    })

    socket.on("join room", response => {
      if(response.status === "Ok") {
        dispatch(addPlayers(response.name))
        dispatch(setRoute(`/lobby/${roomID}`))
      }
    })
  }, [])

  useEffect(() => {
    history.push(route)
  }, [route])

  return (
    <React.Fragment >
      <Route path="/lobby/:roomID">
        <Lobby />
      </Route>'
      <Route path="/testRoom">
        <GameRoom hand={testHand} players={["Me", "Opponent 1", "two", "three"]} testing={true} />
      </Route>
      <Route path="/">
        <MainPage />
      </Route>
    </React.Fragment>
  )
}