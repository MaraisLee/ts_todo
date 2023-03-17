import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { fireDB } from "../firebase";

//fb 연동
// firebase Storage 이름
const firebaseStorageName = "tsmemo";
// 컬렉션(DataBase 단위: MongoDB 참조) 불러오기
const memoCollectionRef = collection(fireDB, firebaseStorageName);
// db 읽기
export const getTodoFB = createAsyncThunk(
  "todo/getTodo",
  async (_, thunkAPI) => {
    try {
      const q = await query(memoCollectionRef);
      const data = await getDocs(q);

      if (data !== null) {
        // initData = JSON.parse(data);
        // 모든 데이터 가져와서 뜯기
        // [ {}, {}, {}, ....]
        const firebaseData = data.docs.map((doc) => ({
          ...doc.data(),
        }));
        // firebaseData = [ {}, {}, {}, ....]
        // Array<TodoType> 형태가 아니라서 아래로 변환한다.
        const initData = firebaseData.map((item) => {
          // 파이어베이스에서 가져온 데이터를
          // TypeScript 에서 우리가 만든 Type 으로 형변환하기
          return item as TodoType;
        });
        return initData;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
//목록추가
export const addTodoFB = createAsyncThunk(
  "todo/addTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      const res = await setDoc(doc(fireDB, firebaseStorageName, tempTodo.uid), {
        uid: tempTodo.uid,
        title: tempTodo.title,
        body: tempTodo.body,
        date: tempTodo.date,
        sticker: tempTodo.sticker,
        done: false,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 업데이트
export const updateTodoFB = createAsyncThunk(
  "todo/updateTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      const res = await updateDoc(userDoc, {
        title: tempTodo.title,
        body: tempTodo.body,
        sticker: tempTodo.sticker,
        done: tempTodo.done,
        date: moment(tempTodo.date).format("YYYY-MM-DD"),
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 삭제
export const deleteTodoFB = createAsyncThunk(
  "todo/deleteTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      // firebase 데이터 1개 삭제
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      const res = await deleteDoc(userDoc);
      // console.log(res); // res는 undefined
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 검색
export const sortTodoFB = createAsyncThunk(
  "todo/sortTodo",
  async (sortType: string, thunkAPI) => {}
);
// 전체 삭제
export const clearTodoFB = createAsyncThunk(
  "todo/clearTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      // firebase 데이터 1개 삭제
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      try {
        const res = await deleteDoc(userDoc);
        // console.log(res); // res는 undefined
      } catch (e) {
        console.log(e);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

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
  //동기 reducer :
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
  // 비동기 reducer : 서버 연동
  extraReducers: (builder) => {
    // pending: 서버 연결
    // fulfilled : 데이터 회신
    // rejected : 데이터 회신 오류
    builder
      // 전체자료 호출
      .addCase(getTodoFB.pending, (state, action) => {})
      .addCase(getTodoFB.fulfilled, (state, action) => {
        // 자료형을 변환해서 저장해야한다. typeScript
        state.todoList = action.payload as Array<TodoType>;
      })
      .addCase(getTodoFB.rejected, (state, action) => {})
      // 할일 추가
      .addCase(addTodoFB.pending, (state, action) => {})
      .addCase(addTodoFB.fulfilled, (state, action) => {})
      .addCase(addTodoFB.rejected, (state, action) => {})
      // 수정
      .addCase(updateTodoFB.pending, (state, action) => {
        console.log("getTodoFB.pending");
      })
      .addCase(updateTodoFB.fulfilled, (state, action) => {
        console.log("getTodoFB.fulfilled");
      })
      .addCase(updateTodoFB.rejected, (state, action) => {
        console.log("getTodoFB.rejected");
      })
      // 삭제
      .addCase(deleteTodoFB.pending, (state, action) => {})
      .addCase(deleteTodoFB.fulfilled, (state, action) => {})
      .addCase(deleteTodoFB.rejected, (state, action) => {})
      // 정렬
      .addCase(sortTodoFB.pending, (state, action) => {})
      .addCase(sortTodoFB.fulfilled, (state, action) => {})
      .addCase(sortTodoFB.rejected, (state, action) => {})
      // 전체 삭제
      .addCase(clearTodoFB.pending, (state, action) => {})
      .addCase(clearTodoFB.fulfilled, (state, action) => {})
      .addCase(clearTodoFB.rejected, (state, action) => {});
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
