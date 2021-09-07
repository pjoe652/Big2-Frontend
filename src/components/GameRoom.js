import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { numberValue, suitValue, addCardValue } from '../utils/cardValue';
import { evaluateHand } from '../utils/gameLogic';
import Draggable from 'react-draggable';

import { DesktopLg, Desktop, TabletLand, Tablet, Phone, PhoneSm } from '../constants/screenWidth'
import socket from 'socket.io-client/lib/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setPlayers } from '../store/actions/game';

function GameRoom(props) {
  const carouselPlayers = useSelector(state => state.game.currentPlayers)
  const socket = useSelector(state => state.game.socket)
  const username = useSelector(state => state.game.username)
  const code = useSelector(state => state.game.roomID)
  const location = useLocation()
  const dispatch = useDispatch()

  const [selected, setSelected] = useState([])
  const [cardsPerRow, setCardsPerRow] = useState(13)
  const [hand, setHand] = useState(props.hand)
  const [cardWidth, setCardWidth] = useState(0)
  const [carouselActive, setCarouselActive] = useState(props.startingPlayerIndex)
  const [displayHand, setDisplayHand] = useState([])
  const [cardStart, setCardStart] = useState(false)
  const [previousHand, setPreviousHand] = useState([])
  const [handToBeat, setHandToBeat] = useState(null)

  useEffect(() => {
    const valueHand = hand

    if (location.pathname !== "/testRoom") {
      socket.on("hand played", response => {
        if (response) {
          console.log(response)
          setHandToBeat(response.hand)
          nextOpponent()
        }
      })
    } else {
      dispatch(setPlayers(["Me", "Opponent 1", "two", "three"]))
      console.log("Else")
    }

    valueHand.forEach(card => {
      card.value = numberValue[card.number] * 4 + suitValue[card.suit]
      card.hidden = false
    })

    valueHand.sort((a, b) => (a.value > b.value) ? 1 : -1)

    updateHandRow()

    setHand(valueHand)

    window.addEventListener('resize', updateHandRow)

    return () => window.removeEventListener('resize', updateHandRow)
  }, [])

  useEffect(() => {
    updateHandRow()
  }, [hand])

  function updateHandRow() {
    const tempHand = hand;

    let itemsPerRow = 13
    let tempColumnItems = []
    let tempArray = []

    if (window.innerWidth < Tablet) {
      itemsPerRow = 5
    } else if (window.innerWidth < TabletLand) {
      itemsPerRow = 8
    }

    tempHand.forEach(card => {
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

    setHand(tempHand)
    setDisplayHand(tempColumnItems)
    setCardsPerRow(itemsPerRow)
    updateCardWidth()
    sortHand()
  }

  function sortHand() {
    const sortedHand = hand

    sortedHand.sort((a, b) => (a.value > b.value) ? 1 : -1)

    setHand(sortedHand)
  }

  function onCardClick(card) {
    const tempSelected = selected
    if(selected.includes(card)) {
      const filteredSelected = selected.filter(existingCards => existingCards !== card)

      setSelected(filteredSelected)
    } else {
      tempSelected.push(card)
      setSelected(tempSelected)
    }
  }

  function dropCard(event, data) {
    const tempHand = hand
    const tempSelected = selected

    if(event.target.id) {
      const dropzoneLowerBound = window.innerHeight * 0.66 + window.scrollY;

      if(((event.pageY && event.pageY < dropzoneLowerBound) || (event.changedTouches && event.changedTouches[0].pageY && event.changedTouches[0].pageY < dropzoneLowerBound)) && selected.length < 5) {
        const number = event.target.id.split("-")[0]
        const suit = event.target.id.split("-")[1]
        const selectedCard = tempHand.filter(card => card.suit === suit && card.number === number)[0]

        tempHand.forEach(card => {
          if (card.suit === suit && card.number === number) {
            card.hidden = true
          }
        })
  
        tempSelected.push(selectedCard)
  
        setHand(tempHand)
        setSelected(tempSelected)
        setCardStart(false)

      } else {
        console.log("Max number of cards is 5")
      }
    }
    setCardStart(false)
  }

  function playHand() {
    const evaluatedHand = evaluateHand(selected, previousHand, carouselPlayers[props.startingPlayerIndex].toString() === username)
    
    if (evaluatedHand) {
      const filteredHand = hand.filter(card => !selected.some(DHCard => DHCard.number === card.number && DHCard.suit === card.suit))
      setHand(filteredHand)
      setSelected([])
      socket.emit("play hand", { hand: evaluatedHand, name: username, code: code })
    } else {
      console.log("invalid hand")
    }
  }

  function updateCardWidth() {
    const tempWidth = window.innerWidth/(cardsPerRow * 1.2)

    setCardWidth(tempWidth)
  }

  function nextOpponent() {
    let tempCarouselActive = 0;
    if (carouselActive === carouselPlayers.length - 1) {
      tempCarouselActive = 0
    } else {
      tempCarouselActive++
    }

    setCarouselActive(tempCarouselActive)
  }

  function clearHand() {
    let tempDisplayHand = displayHand
    tempDisplayHand.forEach(row => {
      row.forEach(card => {
        card.hidden = false
      })
    })

    setDisplayHand(tempDisplayHand)
    setSelected([])
  }

  function handleStart() {
    setCardStart(true)
  }
  
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
                      {player === username ? `It's your turn!` : `It's ${player}'s turn`}
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="previous-hand-container">
            {
              handToBeat ? handToBeat.cardPool.map((card, i) => {
                return(
                  <img key={`img-${i}-played`} className="card" src={`${process.env.PUBLIC_URL}/cards/${addCardValue(card.value)}${card.suit}.svg`} style={{"--card-width": `${cardWidth}px`}} alt=""></img>
                )
              })
              : <React.Fragment />
            }
          </div>
        </div>
        <div className="clear-hand-button" onClick={clearHand}>
          <span>Clear Hand</span>
        </div>
        <div className="player-field-container">
          <div className={cx({
            "playing-hand-container": true
          })} style={{'--total-cards': selected.length}}>
            <div className={cx({
              "overlay": true,
              "skip": selected.length === 0,
              "play": selected.length !== 0,
              "awaiting-turn": carouselPlayers[carouselActive] !== username
            })} />
            <div className={cx({
              "overlay-header": true,
              "skip": selected.length === 0,
              "play": selected.length !== 0,
              "awaiting-turn": carouselPlayers[carouselActive] !== username
            })} onClick={carouselPlayers[carouselActive] === username ? playHand : null}>
              {
                carouselPlayers[carouselActive] === username ? (selected.length === 0 ? "Skip" : "Play") : "It isn't your turn!"
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
                          <Draggable position={{x: 0, y: 0}} onStart={card.hidden || selected.length > 4 ? null : handleStart} onStop={selected.length > 4 ? null : dropCard} defaultPosition={{x: 0, y: 0}}>
                            <img key={`img-${i}`} id={`${card.number}-${card.suit}`} className={cx({
                              "card": true,
                              "hidden": card.hidden,
                              "empty": card.empty
                            })} src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} alt="" 
                              style={{'--cards-per-row': cardsPerRow}}
                            />
                          </Draggable>
                          : 
                          <img key={`img-${i}`} id={`${card.number}-${card.suit}`} src="" alt="" 
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
  // }
}
export default GameRoom