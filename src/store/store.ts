import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// persist 적용
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

const reducers = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};
const presistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: presistedReducer,
  // 임시로 middleware 체크 기능 제거
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

// useSelctor 를 사용하는 경우에 지정할 타입을 작성
export type RootState = ReturnType<typeof store.getState>;

// useDispatch 를 활용하는 경우에 지정할 타입 작성
export type AppDispatch = typeof store.dispatch;
