import cx from 'classnames';
import React from 'react';
import { numberValue, suitValue } from '../utils/cardValue';
import { evaluateHand } from '../utils/gameLogic';
import Draggable from 'react-draggable';

import { DesktopLg, Desktop, TabletLand, Tablet, Phone, PhoneSm } from '../constants/screenWidth'

class GameRoom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: [],
      cardsPerRow: 13,
      hand: this.props.hand,
      cardWidth: 0,
      carouselPlayers: [...props.players],
      carouselActive: 0,
      displayHand: [],
      cardStart: false,
      previousHand: []
    }
  }

  componentDidMount = () => {
    const { carouselPlayers } = this.state
    const valueHand = this.state.hand

    valueHand.forEach(card => {
      card.value = numberValue[card.number] * 4 + suitValue[card.suit]
      card.hidden = false
    })

    if(carouselPlayers.length === 2) {
      carouselPlayers.forEach(player => {
        carouselPlayers.push(player)
      })
      this.setState({
        carouselPlayers: carouselPlayers
      })
    }

    valueHand.sort((a, b) => (a.value > b.value) ? 1 : -1)

    this.updateHandRow()

    this.setState({
      hand: valueHand
    })

    window.addEventListener('resize', this.updateHandRow)
  }

  componentWillMount() {
    window.removeEventListener('resize', this.updateHandRow)
  }

  updateHandRow = () => {
    const { hand } = this.state

    let itemsPerRow = 13
    let tempColumnItems = []
    let tempArray = []

    if (window.innerWidth < Tablet) {
      itemsPerRow = 5
    } else if (window.innerWidth < TabletLand) {
      itemsPerRow = 8
    }

    hand.forEach(card => {
      card.empty = false
      tempArray.push(card)
      if (tempArray.length === itemsPerRow) {
        tempColumnItems.push(tempArray)
        tempArray = []
      }
    })

    while (tempArray.length < itemsPerRow && tempArray.length !== 0) {
      tempArray.push({empty: true})
    }

    tempColumnItems.push(tempArray)

    this.setState({
      displayHand: tempColumnItems,
      cardsPerRow: itemsPerRow
    }, () => {
      this.updateCardWidth()
    })
  }

  sortHand = () => {
    const sortedHand = this.state.hand

    sortedHand.sort((a, b) => (a.value > b.value) ? 1 : -1)

    this.setState({
      hand: sortedHand
    })
  }

  onCardClick = (card) => {
    const { selected } = this.state

    if(selected.includes(card)) {
      const filteredSelected = selected.filter(existingCards => existingCards !== card)

      this.setState({
        selected: filteredSelected
      })
    } else {
      selected.push(card)
      this.setState({
        selected: selected
      })
    }
  }

  dropCard = (event, data) => {
    const { hand, selected } = this.state

    if(event.target.id) {
      const dropzoneLowerBound = document.getElementsByClassName("dropzone-container")[0].offsetHeight + document.body.scrollTop

      if(((event.pageY && event.pageY < dropzoneLowerBound) || (event.changedTouches && event.changedTouches[0].pageY && event.changedTouches[0].pageY < dropzoneLowerBound)) && selected.length < 5) {
        const number = event.target.id.split("-")[0]
        const suit = event.target.id.split("-")[1]
        const selectedCard = hand.filter(card => card.suit === suit && card.number === number)[0]

        hand.forEach(card => {
          if (card.suit === suit && card.number === number) {
            card.hidden = true
          }
        })
  
        selected.push(selectedCard)
  
        this.setState({
          hand: hand,
          selected: selected,
          cardStart: false
        })
      } else {
        console.log("Max number of cards is 5")
      }
    }

    this.setState({
      cardStart: false
    })
  }

  playHand = () => {
    const { selected, previousHand } = this.state;
    console.log(evaluateHand(selected, previousHand))
  }

  updateCardWidth = () => {
    const { hand, cardsPerRow } = this.state

    const tempWidth = window.innerWidth/(cardsPerRow * 1.2)

    this.setState({
      cardWidth: tempWidth
    })
  }

  nextOpponent = () => {
    let { carouselActive, carouselPlayers } = this.state

    if (carouselActive === carouselPlayers.length - 1) {
      carouselActive = 0
    } else {
      carouselActive++
    }

    this.setState({
      carouselActive: carouselActive
    })
  }

  clearHand = () => {
    let { displayHand } = this.state;

    displayHand.forEach(row => {
      row.forEach(card => {
        card.hidden = false
      })
    })

    this.setState({
      displayHand: displayHand,
      selected: []
    })
  }

  handleStart = () => {
    this.setState({
      cardStart: true,
    })
  }

  stopDrag = (e) => {
    e.preventDefault()
    return null
  }

  render() {
    const { hand, cardsPerColumn, selected, cardWidth, carouselPlayers, carouselActive, displayHand, cardsPerRow, cardStart } = this.state
    const { players } = this.props

    return(
      <div className="game-room-container">
        <div className={cx({"dropzone-container": true, "hidden": !cardStart})}>
          <div className="dropzone-block"/>
          <div className="dropzone-fade"/>
        </div>
        <div className="opponent-field-container">
          <div className="opponent-slider">
            {
              carouselPlayers.map((player, i) => {
                return(
                  <div className={cx({
                    "active": carouselActive === i,
                    "hidden": carouselActive > i || (carouselActive === 0 && i === carouselPlayers.length - 1),
                    "first-player": carouselActive > 1 && i === 0,
                    "user-container": true
                    })} id={i} 
                  >
                    <img className="user-img" src="/user.png" alt="" />
                    <div className="user-name">
                      {player}
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div onClick={this.nextOpponent}>
            tempCycle
          </div>
          <div className="previous-hand-container">

          </div>
        </div>
        <div className="clear-hand-button" onClick={this.clearHand}>
          <span>Clear Hand</span>
        </div>
        <div className="player-field-container">
          <div className={cx({
            "playing-hand-container": true
          })} style={{'--total-cards': selected.length}}>
            <div className={cx({
              "overlay": true,
              "skip": selected.length === 0,
              "play": selected.length !== 0
            })} />
            <div className={cx({
              "overlay-header": true,
              "skip": selected.length === 0,
              "play": selected.length !== 0
            })} onClick={this.playHand}>
              {
                selected.length === 0 ? "Skip" : "Play"
              }
            </div>
            {
              selected.map((card, i) => {
                return(
                  <img key={`img-${i}`} className="card" src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} style={{"--card-width": `${cardWidth}px`}} alt=""></img>
                )
              })
            }
          </div>
          <div className="current-hand-container">
            {
              displayHand.map(row => {
                return(
                  <div className="hand-row">
                    {
                      row.map((card, i) => {
                        return(
                          !card.empty ? 
                          <Draggable position={{x: 0, y: 0}} onStart={card.hidden || selected.length > 4 ? null : this.handleStart} onStop={selected.length > 4 ? null : this.dropCard} defaultPosition={{x: 0, y: 0}}>
                            <img key={`img-${i}`} id={`${card.number}-${card.suit}`} className={cx({
                              "card": true,
                              "hidden": card.hidden,
                              "empty": card.empty
                            })} src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} alt="" 
                              style={{'--cards-per-row': cardsPerRow}}
                            />
                          </Draggable>
                          : 
                          <img key={`img-${i}`} id={`${card.number}-${card.suit}`} className={cx({
                            // "card": true,
                            // "hidden": card.hidden,
                            // "empty": card.empty
                          })} src="" alt="" 
                            style={{'--cards-per-row': cardsPerRow}}
                          />
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
export default GameRoom