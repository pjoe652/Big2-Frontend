import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'

export default function WaitingRoom(props) {
  const { error, onStartClick } = props

  const currentPlayers = useSelector(state => state.game.currentPlayers)
  const roomID = useSelector(state => state.game.roomID)

  return(
    <div className="waiting-room-container">
      <div className="code-wrapper">
        {`Code: ${roomID}`}
      </div>
      {
        currentPlayers.map(player => {
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