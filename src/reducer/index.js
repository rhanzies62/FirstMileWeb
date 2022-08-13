import { combineReducers } from "redux";
import equipments from "./equipmentReducer";
import auth from "./authReducer";

const rootReducer = combineReducers({
  equipments,
  auth,
});

export default rootReducer;
