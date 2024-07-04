import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import dataReducer from "./dataReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  data: dataReducer,
});

export default rootReducer;
