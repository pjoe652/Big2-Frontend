import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams, withRouter } from 'react-router-dom'
import WaitingRoom from './WaitingRoom'
import GameRoom from './GameRoom'
import { useDispatch, useSelector } from 'react-redux';

export default function Lobby(props) {
  // const { socket, username, history } = props

  const [error, setError] = useState("")
  const [hand, setHand] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(null)

  const socket = useSelector(state => state.game.socket)
  const username = useSelector(state => state.game.username)
  const currentPlayers = useSelector(state => state.game.currentPlayers)
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    console.log("In lobby")
    console.log(username, location)
    if (!username && location.search !== "?test=true") {
      history.push(`/`)
    } else {
      setGameSockets()
    }
  }, [])

  function setGameSockets() {
    socket.on("start game", response => {
      if (response) {
        console.log(response)
        setHand(response.hand)
        setStartingPlayerIndex(response.startingPlayerIndex)
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
      gameStarted ? 
        <GameRoom socket={socket} hand={hand} players={currentPlayers} username={username} startingPlayerIndex={startingPlayerIndex}/> 
        : 
        <WaitingRoom error={error} onStartClick={onStartClick}/>
  )
}