import { createSlice } from "@reduxjs/toolkit";
// action : 함수로서 store의 state를 업데이트
import type { PayloadAction } from "@reduxjs/toolkit";

//초기 값의 타입정의
export type CounterState = {
  value: number;
};
const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  // initialState: initialState,
  initialState,
  //리듀서들을 배치
  reducers: {
    // 더하기 action
    increment: (state) => {
      state.value += 1;
    },
    // 빼기 action
    decrement: (state) => {
      state.value -= 1;
    },
    // 일정한 수 만큼 증가
    // action: PayloadAction<T>
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});
//action을 내보낸다
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
// slice의 reducer 를 내보낸다
export default counterSlice.reducer;
