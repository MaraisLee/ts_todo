import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};

export type TodoState = {
  todoList: Array<TodoType>;
};
const initialState: TodoState = {
  todoList: [],
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    // 배열전체를 다불러옴  action: PayloadAction<Array<TodoType>>
    initTodoState: (state, action: PayloadAction<Array<TodoType>>) => {
      state.todoList = action.payload;
    },
    addTodoState: (state, action: PayloadAction<TodoType>) => {
      // todoList: Array<TodoType>;
      // action에 TodoType 담겨있음
      // = initialState.todoList
      state.todoList.push(action.payload);
    },
    updateTodoState: (state, action: PayloadAction<TodoType>) => {
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );

      // state.todoList[index].uid = action.payload.uid;
      // state.todoList[index].title = action.payload.title;
      // state.todoList[index].body = action.payload.body;
      // state.todoList[index].date = action.payload.date;
      // state.todoList[index].sticker = action.payload.sticker;
      // state.todoList[index].done = action.payload.done;

      state.todoList[index] = { ...action.payload };
    },
    deleteTodoState: (state, action: PayloadAction<TodoType>) => {
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );
      state.todoList.splice(index, 1);
    },
    sortTodoState: (state, action: PayloadAction<string>) => {},
    clearTodoState: (state) => {
      state.todoList = [];
    },
  },
});

export const {
  initTodoState,
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
} = todoSlice.actions;

export default todoSlice.reducer;
