import React from 'react'

class MainPage extends React.Component {
  render() {
    return(
      <div className="main-page-container">
        <div className="header">
          Big2.io
        </div>
        <div className="host button">
          Host a game
        </div>
        <div className="join button">
          Join a game
        </div>
      </div>
    )
  }
}

export default MainPage