import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import WaitingRoom from './WaitingRoom'
import GameRoom from './GameRoom'
import history from '../utils/history';
import { useDispatch, useSelector } from 'react-redux';

function Lobby(props) {
  // const { socket, username, history } = props

  const [error, setError] = useState("")
  const [hand, setHand] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)

  const socket = useSelector(state => state.game.socket)
  const username = useSelector(state => state.game.username)
  const currentPlayers = useSelector(state => state.game.currentPlayers)
  const dispatch = useDispatch()

  console.log(socket, username, currentPlayers)

  useEffect(() => {
    console.log("username ", username)
    if (!username) {
      // history.push(`/`)
      // history.go(0)
    } else {
      setGameSockets()
    }
  }, [])

  function setGameSockets() {
    socket.on("new player", user => {
      dispatch(user)
    })

    socket.on("start game", response => {
      if (response) {
        setHand(response.hand)
        setGameStarted(true)
      }
    })
  }

  function onStartClick() {
    if (currentPlayers.length <= 1) {
      setError("You must have more than one player")
    } else {
      setError("")
      socket.emit("start game")
    }
  }
  
  return(
      // gameStarted ? 
      //   <GameRoom socket={socket} hand={hand} players={players} username={username} code={roomID}/> 
      //   : 
        <WaitingRoom error={error} onStartClick={onStartClick}/>
  )
}

export default withRouter(Lobby)