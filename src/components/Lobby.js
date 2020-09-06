import React from 'react'
import { withRouter } from 'react-router-dom'
import WaitingRoom from './WaitingRoom'
import GameRoom from './GameRoom'

class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: props.currentPlayers ? props.currentPlayers : [props.username],
      error: "",
      hand: null,
      gameStarted: false,
      roomID: ""
    }
  }

  componentDidMount() {
    const { socket } = this.props

    this.setState({
      roomID: window.location.pathname.split('/')[2]
    })

    if (!this.props.username) {
      this.props.history.push(`/`)
    } else {
      socket.on("new player", user => {
        this.setState({
          players: [...this.state.players, user]
        })
      })

      socket.on("start game", response => {
        if (response) {
          this.setState({
            hand: response.hand,
            gameStarted: true
          })
        }
      })
    }
  }

  onStartClick = () => {
    const { players } = this.state
    const { socket } = this.props

    if (players.length <= 1) {
      this.setState({
        error: "You must have more than one player"
      })
    } else {
      this.setState({
        error: ""
      })

      socket.emit("start game")
    }
  }

  render() {
    const { players, error, roomID, gameStarted, hand } = this.state
    
    return(
        gameStarted ? <GameRoom hand={hand} players={players}/> : <WaitingRoom players={players} error={error} roomID={roomID} onStartClick={this.onStartClick}/>
    )
  }
}

export default withRouter(Lobby)