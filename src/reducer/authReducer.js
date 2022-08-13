import * as types from "../action/actionTypes";
import initialState from "./initialState";

export default function authReducer(state = initialState.auth, action) {
  switch (action.type) {
    case types.UPDATE_AUTH:
      return { isLoggedIn: action.value };
    case types.UPDATE_USERINFO:
      return { ...state, userType: action.value };
    case types.UPDATE_LOGININFO: {
      let authObj = { ...action.value, menus: [], routes: [] };
      authObj.menus =
        action.value.userType === "1"
          ? [...initialState.adminMenu]
          : [...initialState.userMenu];
      authObj.routes =
        action.value.userType === "1"
          ? [...initialState.adminRoutes]
          : [...initialState.userRoutes];
      return { ...state, ...authObj };
    }
    default:
      return state;
  }
}
