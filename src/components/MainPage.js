import React from 'react'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'

class MainPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      roomId: "",
      username: "",
      errored: false,
      roomIdModal: false
    }
  }

  onRoomIdChange = (e) => {
    this.setState({
      roomId: e.target.value
    })
  }

  openModal = () => {
    if(!this.props.username) {
      this.setState({
        errored: true
      })
    } else {
      this.setState({
        roomIdModal: true
      })
    }
  }

  closeModal = () => {
    this.setState({
      roomIdModal: false
    })
  }

  resetError = () => {
    this.setState({
      errored: false
    })
  }

  missingUsername = () => {
    this.setState({
      errored: true
    })
  }

  joinRoom = () => {
    const { roomId } = this.state
    const { socket, username } = this.props

    socket.on("join room", response => {
      console.log(response)
    })
    socket.emit("join room", { name: username, code: roomId })
  }

  createRoom = () => {
    const { socket, username } = this.props

    socket.on("create room", response => {
      if(response.status === "Ok") {
        this.setState({
          roomId: response.code,
          redirect: `/lobby/${this.state.roomId}`
        })
        this.props.history.push(`/lobby/${this.state.roomId}`)
      }
    })
    socket.emit("create room", username)
  }

  render() {
    const { roomIdModal } = this.state
    const { username } = this.props

    return(
      <div className="main-page-container">
        <div className={cx({
          "modal-wrapper": true,
          "hidden": !roomIdModal
        })}>
          <div className="modal-container" onClick={this.closeModal}/>
          <div className="modal-box">
            <span className="header">
              Enter Room Id
            </span>
            <input className="namefield button" type="text" placeholder="Room Id" onChange={this.onRoomIdChange} />
            <div className="button" onClick={this.joinRoom}>
              Enter Room
            </div>
          </div>
        </div>
        <div className="header">
          Big2.io
        </div>
        <input className={cx({
            "namefield button": true,
            "errored": this.state.errored
          })} 
          type="text" 
          placeholder="Your name" 
          onChange={this.props.onUsernameChange}
          onAnimationEnd={this.resetError}
        />
        <div className="host button" onClick={ username ? this.createRoom : this.missingUsername }>
          Host a game
        </div>
        <div className="join button" onClick={ username ? this.openModal : this.missingUsername}>
          Join a game
        </div>
      </div>
    )
  }
}

export default withRouter(MainPage)