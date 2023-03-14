import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    //slice 작성
    counter: counterReducer,
    user: userReducer,
  },
});

// useSelctor 를 사용하는 경우에 지정할 타입을 작성
export type RootState = ReturnType<typeof store.getState>;

// useDispatch 를 활용하는 경우에 지정할 타입 작성
export type AppDispatch = typeof store.dispatch;
