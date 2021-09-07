import React, { useState } from 'react'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addPlayers, setGameRoomID, setUsername } from '../store/actions/game'

function MainPage() {
  const [username, setLocalUsername] = useState("")
  const [roomID, setRoomID] = useState("")
  const [errored, setErrored] = useState(false)
  const [roomIdModal, setRoomIdModal] = useState(false)
  const socket = useSelector(state => state.game.socket)
  const dispatch = useDispatch()

  function openModal() {
    if(!username) {
      setErrored(true)
    } else {
      setRoomIdModal(true)
    }
  }

  function closeModal() {
    setRoomIdModal(false)
  }

  function resetError() {
    setErrored(false)
  }

  function missingUsername() {
    setErrored(true)
  }

  function joinRoom() {
    dispatch(setUsername(username))
    socket.emit("join room", { name: username, code: roomID })
    setRoomIdModal(false)
  }

  function createRoom() {
    dispatch(setUsername(username))
    socket.emit("create room", username)
  }

  function onUsernameChange(e) {
    dispatch(setUsername(username))
    setLocalUsername(e.target.value)
  }

  function onRoomIDChange(e) {
    setRoomID(e.target.value)
  }

  return(
    <div className="main-page-container">
      <div className={cx({
        "modal-wrapper": true,
        "hidden": !roomIdModal
      })}>
        <div className="modal-container" onClick={closeModal}/>
        <div className="modal-box">
          <span className="header">
            Enter Room Id
          </span>
          <input className="namefield button" type="text" placeholder="Room Id" onChange={onRoomIDChange} />
          <div className="button" onClick={joinRoom}>
            Enter Room
          </div>
        </div>
      </div>
      <div className="header">
        Big2.io
      </div>
      <input className={cx({
          "namefield button": true,
          "errored": errored
        })} 
        type="text" 
        placeholder="Your name" 
        onChange={onUsernameChange}
        onAnimationEnd={resetError}
      />
      <div className="host button" onClick={ username ? createRoom : missingUsername }>
        Host a game
      </div>
      <div className="join button" onClick={ username ? openModal : missingUsername}>
        Join a game
      </div>
    </div>
  )
}

export default withRouter(MainPage)