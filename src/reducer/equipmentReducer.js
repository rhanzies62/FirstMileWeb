import * as types from "../action/actionTypes";
import initialState from "./initialState";

export default function equimentReducer(state = initialState.equiment, action) {
  switch (action.type) {
    case types.SAVE_EQUIPMENTS:
      return action.equiments;
    default:
      return state;
  }
}
