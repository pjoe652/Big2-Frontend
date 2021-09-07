import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { ADD_PLAYERS, SET_ROUTE, SET_ROOM_ID, SET_USERNAME, SET_PLAYERS } from "../constants"
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:8001/"
const socket = socketIOClient(ENDPOINT)
export const socketIoMiddleware = createSocketIoMiddleware(socket, "");

const initialState = {
  socket: socket,
  roomID: "",
  username: "",
  route: "/",
  pageState: "mainPage",
  currentPlayers: []
}

const gameReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_ROOM_ID:
      return {
        ...state,
        roomID: action.payload
      }
    case ADD_PLAYERS:
      return {
        ...state,
        currentPlayers: [...state.currentPlayers, action.payload]
      }
    case SET_PLAYERS:
      return {
        ...state,
        currentPlayers: action.payload
      }
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload
      }
    case SET_ROUTE:
      return {
        ...state,
        route: action.payload
      }
    default:
      return state
  }
}

export default gameReducer