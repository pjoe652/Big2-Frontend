import React from 'react'
import cx from 'classnames'

class WaitingRoom extends React.Component {
  render() {
    const { players, error, roomID, onStartClick } = this.props

    return(
      <div className="waiting-room-container">
        <div className="code-wrapper">
          {`Code: ${roomID}`}
        </div>
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
        <div className="start-button" onClick={onStartClick}>
          Start Game
        </div>
        <div className={cx({
          "error-field": true,
          "error": error
        })}>
          {error}
        </div>
      </div>
    )
  }
}

export default WaitingRoom