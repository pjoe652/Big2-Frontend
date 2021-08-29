import { ADD_PLAYERS, SET_ROUTE, SET_ROOM_ID, SET_USERNAME } from "../constants"

export const setGameRoomID = (roomID) => {
  return {
    type: SET_ROOM_ID,
    payload: roomID
  }
}

export const addPlayers = (player) => {
  return {
    type: ADD_PLAYERS,
    payload: player
  }
}

export const setUsername = (username) => {
  return {
    type: SET_USERNAME,
    payload: username
  }
}

export const setRoute = (route) => {
  return {
    type: SET_ROUTE,
    payload: route
  }
}