import * as Types from "./actionTypes";

export function updateAuthentication(value) {
  return { type: Types.UPDATE_AUTH, value };
}

export function updateUserInfo(value) {
  return { type: Types.UPDATE_USERINFO, value };
}

export function updateLoginInfo(value) {
  return { type: Types.UPDATE_LOGININFO, value };
}

export function updateAuthInfo(value){
  return { type: Types.UPDATE_LOGININFO, value };
}
