import React from 'react'
import CodeWrapper from './CodeWrapper'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: props.currentPlayers ? props.currentPlayers : [props.username],
      error: ""
    }
  }

  componentDidMount() {
    const { socket } = this.props

    if (!this.props.username) {
      this.props.history.push(`/`)
    } else {
      socket.on("new player", user => {
        console.log(user)
        this.setState({
          roomId: window.location.pathname.split('/')[2],
          players: [...this.state.players, user]
        })
      })
    }
  }

  onStartClick = () => {
    const { players, roomId } = this.state
    const { socket } = this.props

    if (players.length <= 1) {
      this.setState({
        error: "You must have more than one player"
      })
    } else {
      this.setState({
        error: ""
      })

      console.log(roomId)
      socket.emit("start game", { roomCode: roomId })
      socket.on("start game", response => {
        console.log(response)
      })
    }
  }

  render() {
    const { players, error } = this.state

    return(
      <div className="lobby-container">
        <CodeWrapper />
        {
          players.map(player => {
            return (
              <div className="user-slot">
                <span>
                  {`${ player ? player : "" }`}
                </span>
              </div>
            )
          })
        }
        <div className="start-button" onClick={this.onStartClick}>
          Start Game
        </div>
        <div className={cx({
          "error-field": true,
          "error": error
        })}>
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default withRouter(Lobby)