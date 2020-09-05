import React from 'react'
import cx from 'classnames'
import {Responsive, WidthProvider} from 'react-grid-layout';
import { numberValue, suitValue } from '../utils/cardValue'
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class GameRoom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: [],
      cardsPerColumn: 52/(props.playerCount * 2),
      hand: this.props.hand
    }
  }

  componentDidMount = () => {
    const valueHand = this.state.hand

    valueHand.forEach(card => {
      card.value = numberValue[card.number] * 4 + suitValue[card.suit]
    })

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

    console.log(card)

    if(selected.includes(card)) {
      const filteredSelected = selected.filter(existingCards => existingCards !== card)
      console.log(selected)
      console.log(filteredSelected)

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

  render() {
    const { hand, cardsPerColumn, selected } = this.state

    console.log(hand)

    return(
      <div className="game-room-container">
        <div className="open-view-container">
          <div className="opponent-container">

          </div>
        </div>
        <div onClick={this.sortHand}>
          Click here to sort Hand
        </div>
        <ResponsiveReactGridLayout className="layout" breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}} cols={{lg: cardsPerColumn, md: 10, sm: 6, xs: 4, xxs: 2}} rowHeight={125} useCSSTransforms>
          {
            hand.map((card, i) => {
              console.log(selected)
              return(
                <div key={i} data-grid={{x: (i) % cardsPerColumn, y: Math.floor((i) / cardsPerColumn), w: 1, h: 1}} onClick={() => this.onCardClick(card)}>
                  <img key={`img-${i}`} className={cx({
                    "card": true,
                    "selected": selected.includes(card)
                  })} src={`${process.env.PUBLIC_URL}/cards/${card.number}${card.suit}.svg`} alt=""></img>
                </div>
              )
            })
          }
        </ResponsiveReactGridLayout>
      </div>
    )
  }
}
export default GameRoom