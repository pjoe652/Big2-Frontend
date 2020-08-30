import React from 'react'
import CodeWrapper from './CodeWrapper'

class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [props.username, null, null, null]
    }
  }

  componentDidMount() {

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

export default Lobby