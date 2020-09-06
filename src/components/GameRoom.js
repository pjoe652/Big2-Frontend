import cx from 'classnames';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { numberValue, suitValue } from '../utils/cardValue';
const ResponsiveReactGridLayout = WidthProvider(Responsive);


class GameRoom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: [],
      cardsPerColumn: 52/(props.players.length * 2),
      hand: this.props.hand,
      cardWidth: 0,
      carouselPlayers: [...props.players],
      carouselActive: 0
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

    this.setState({
      hand: valueHand
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

  dropCard = (a, card,c,d,event) => {
    const { hand, selected } = this.state

    if(event.target.id) {
      const cardContainerTop = document.getElementsByClassName("react-grid-layout")[0].offsetTop

      if(event.pageY < cardContainerTop && selected.length < 5) {
        const number = card.i.split("-")[0]
        const suit = card.i.split("-")[1]
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
          cardWidth: document.getElementById(event.target.id).clientWidth
        })
      } else {
        console.log("Max number of cards is 5")
      }
    }
  }

  nextOpponent = () => {
    let { carouselActive, carouselPlayers } = this.state

    this.setState({
      carouselActive: ++carouselActive
    })

  }

  stopDrag = (e) => {
    e.preventDefault()
  }

  render() {
    const { hand, cardsPerColumn, selected, cardWidth, carouselPlayers, carouselActive } = this.state
    const { players } = this.props

    console.log(carouselActive)

    return(
      <div className="game-room-container">
        <div className="opponent-field-container">
          <div className="opponent-slider">
            {
              carouselPlayers.map((player, i) => {
                return(
                  <div className={cx({
                    "active": (i - 3 + carouselActive === 0),
                    "hidden": (i - 3 + carouselActive === 3),
                    "user-container": true
                    })} id={i} style={{"--order": (i - 3 + carouselActive) < 3 ? (i - 3 + carouselActive) : -1}}
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
        <div className="player-field-container">
          <div className="playing-hand-container" style={{'--total-cards': selected.length}}>
            {
              selected.map((card, i) => {
                return(
                  <img key={`img-${i}`} className="card" src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} style={{'--card-num': i, '--width': `${cardWidth}px`}} alt=""></img>
                )
              })
            }
          </div>
          <ResponsiveReactGridLayout className="layout" breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}} cols={{lg: cardsPerColumn, md: 10, sm: 6, xs: 4, xxs: 2}} preventCollision rowHeight={100} isResizable={false} onDragStop={(a,b,c,d,event) => this.dropCard(a,b,c,d,event)} containerPadding={[192, 0]}>
            {
              hand.map((card, i) => {
                const dataGrid = {x: (i) % cardsPerColumn, y: Math.floor((i) / cardsPerColumn), w: 1, h: 1}
                return(
                  <div className={cx({"card-container": true, "hidden": card.hidden})} id={`${card.number}-${card.suit}`} key={`${card.number}-${card.suit}`} data-grid={dataGrid} onDragStart={card.hidden ? this.stopDrag : null} >
                    <img key={`img-${i}`} className={cx({
                      "card": true,
                      "hidden": card.hidden
                    })} src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} alt=""></img>
                  </div>
                )
              })
            }
          </ResponsiveReactGridLayout>
        </div>
      </div>
    )
  }
}
export default GameRoom