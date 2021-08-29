const numberValue = {
  "3": 0,
  "4": 1,
  "5": 2,
  "6": 3,
  "7": 4,
  "8": 5,
  "9": 6,
  "10": 7,
  "j": 8,
  "q": 9,
  "k": 10,
  "a": 11,
  "2": 12
}

const suitValue = {
  "D": 1,
  "C": 2,
  "H": 3,
  "S": 4
}

const addCardValue = (currentCard) => {
  return numberValue[currentCard] + 1 > 12 ? "3" : Object.keys(numberValue)[numberValue[currentCard] + 1];
}

export { numberValue, suitValue, addCardValue }