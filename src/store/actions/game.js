import { ADD_PLAYERS, SET_ROUTE, SET_ROOM_ID, SET_USERNAME, SET_PLAYERS } from "../constants"

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

export const setPlayers = (players) => {
  return {
    type: SET_PLAYERS,
    payload: players
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