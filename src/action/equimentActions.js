import * as Types from "./actionTypes";

export function loadEquipmentSuccess(equiments) {
  return { type: Types.SAVE_EQUIPMENTS, equiments };
}
