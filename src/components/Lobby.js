import React from 'react'
import CodeWrapper from './CodeWrapper'
import { withRouter } from 'react-router-dom'

class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: props.currentPlayers ? props.currentPlayers : [props.username]
    }
  }

  componentDidMount() {
    const { socket } = this.props

    if (!this.props.username) {
      this.props.history.push(`/`)
    } else {
      socket.on("new player", user => {
        this.setState({
          players: [...this.state.players, user]
        })
      })
    }
  }

  render() {
    const { players } = this.state

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
      </div>
    )
  }
}

export default withRouter(Lobby)