import { numberValue, suitValue } from './cardValue';
import { Hand } from 'pokersolver';

const validFiveCardHands = ["Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight"]

const evaluateHand = (hand, previousHand) => {
  const adjustedHand = hand.map(card => {
    if (numberValue[card.number] - 1 < 0) {
      return `2${card.suit}`
    } else {
      return `${getKeyByValue(numberValue, numberValue[card.number] - 1)}${card.suit}`
    }
  })

  const adjustedPreviousHand = previousHand.map(card => {
    if (numberValue[card.number] - 1 < 0) {
      return `2${card.suit}`
    } else {
      return `${getKeyByValue(numberValue, numberValue[card.number] - 1)}${card.suit}`
    }
  })

  if (adjustedPreviousHand.length === 0) {
    const solvedHand = Hand.solve(adjustedHand)
    if (validateHand(solvedHand)) {
      return solvedHand;
    }
  } else {
    const winnerHand = Hand.winners([adjustedHand, adjustedPreviousHand])
    if (validateHand(winnerHand)) {
      return winnerHand;
    }
  }

  return false;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function validateHand(hand) {
  if (hand.cards.length === 1) {
    if (hand.name === "High Card") {
      return true;
    }
  } else if (hand.cards.length === 2) {
    if (hand.name === "Pair") {
      return true;
    }
  } else if (hand.cards.length === 3) {
    if (hand.name === "Three of a Kind") {
      return true;
    }
  } else if (hand.cards.length === 4) {
    if (hand.name === "Four of a Kind") {
      return true;
    }
  } else if (hand.cards.length === 5) {
    if (validFiveCardHands.includes(hand.name)) {
      return true;
    }
  }
  return false;
}

export { evaluateHand };

// const evaluateHand = (hand, previousHand) => {
//   const numberOfCards = hand.length

//   if(numberOfCards === 1) {
//     evaluateSingle(hand, previousHand)
//   } else if (numberOfCards === 2) {
//     evaluateDouble(hand, previousHand)
//   } else if (numberOfCards === 3) {
//     evaluateTriple(hand, previousHand)
//   } else if (numberOfCards === 4) {
//     evaluateFour(hand, previousHand)
//   } else if (numberOfCards === 5) {
//     evaluateFive(hand, previousHand)
//   }
// }

// const evaluateSingle = (hand, previousHand) => {
//   if (previousHand.length === 0) {
//     return {
//       hand: hand,
//       type: "single",
//       variation: null
//     }
//   } else {
//     if (previousHand[0].value < hand[0].value) {
//       return {
//         hand: hand,
//         type: "single",
//         variation: null
//       }
//     } else {
//       return false;
//     }
//   }
// }

// const evaluateDouble = (hand, previousHand) => {
//   if (previousHand.length === 0) {
//     let checkNum = null;
//     hand.forEach(card => {
//       if (checkNum) {
//         if (numberValue[card.number] === checkNum) {
//           return {
//             hand: hand,
//             type: "double",
//             variation: null
//           }
//         } else {
//           return false
//         }
//       } else {
//         checkNum = numberValue[card.number]
//       }
//     })
//   } else {
//     let prevCheckNum = numberValue[previousHand[0].number];
//     let prevCheckSuit = [suitValue[previousHand[0].suit], suitValue[previousHand[1].suit]].reduce(function(a, b) {
//       return Math.max(a, b);
//     })

//     let checkNum = null;
//     hand.forEach(card => {
//       if (checkNum) {
//         if (numberValue[card.number] === checkNum) {
//           return {
//             hand: hand,
//             type: "double",
//             variation: null
//           }
//         } else {
//           return false
//         }
//       } else {
//         checkNum = numberValue[card.number]
//       }
//     })
//   }
//   return false;
// }

// const evaluateTriple = (hand, previousHand) => {

// }

// const evaluateFour = (hand, previousHand) => {
  
// }

// const evaluateFive = (hand, previousHand) => {
  
// }