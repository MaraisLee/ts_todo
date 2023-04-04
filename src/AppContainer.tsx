import { useEffect } from "react";
import App from "./App";
// store 관련
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import {
  fbJoinFB,
  fbLoginFB,
  fbLogoutFB,
  fbDeleteUserFB,
} from "./store/userSlice";
import {
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
  addTodoFB,
  deleteTodoFB,
  updateTodoFB,
  clearTodoFB,
  getTodoFB,
} from "./store/todoSlice";

export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};

// 상태를 변경하는 함수를 묶어서 타입으로 정의
export type CallBacksType = {
  addTodo: (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => void;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
  sortTodo: (sortType: string) => void;
  clearTodo?: () => void;
};
export type StatesType = {
  todoList: Array<TodoType>;
};

// 로그인 및 회원가입 타입정의
export type CallBacksFireBaseType = {
  fbLogin: (email: string, password: string) => void;
  fbJoin: (email: string, password: string) => void;
  fbLogout: () => void;
  fbDeleteUser: () => void;
};

const AppContainer = () => {
  // store 코드
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const todo = useSelector((state: RootState) => state.todo);

  // 로컬스토리지 활용 : 파이어베이스로 변경
  const getLocalData = async () => {
    dispatch(getTodoFB());
  };
  // 추가기능
  const addTodo = async (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => {
    dispatch(
      addTodoFB({
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      })
    );
    dispatch(
      addTodoState({
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      })
    );
  };
  // 수정기능
  const updateTodo = async (todo: TodoType) => {
    //서버 연동으로 비동기로 자료를 업로드 (thunk)
    dispatch(updateTodoFB(todo));
    // 동기로 즉시 state 업데이트
    dispatch(updateTodoState(todo));
  };
  // 삭제기능
  const deleteTodo = async (todo: TodoType) => {
    dispatch(deleteTodoFB(todo));
    dispatch(deleteTodoState(todo));
  };
  // 전체 목록 삭제
  const clearTodo = () => {
    dispatch(clearTodoState());
    todo.todoList.forEach(async (element) => {
      await dispatch(clearTodoFB(element));
    });
  };
  // 정렬기능
  const sortTodo = (sortType: string) => {
    dispatch(sortTodoState(sortType));
  };
  // state 관리기능타입
  const callBacks: CallBacksType = {
    addTodo,
    updateTodo,
    deleteTodo,
    sortTodo,
    clearTodo,
  };

  // 데이터목록의 타입
  const states: StatesType = { todoList: todo.todoList };

  // 사용자 가입
  const fbJoin = (email: string, password: string) => {
    dispatch(fbJoinFB({ email, password }));
  };
  // 사용자 로그인 기능
  const fbLogin = (email: string, password: string) => {
    dispatch(fbLoginFB({ email, password }));
  };
  // 사용자 로그아웃
  const fbLogout = () => {
    dispatch(fbLogoutFB());
  };
  // 회원탈퇴
  const fbDeleteUser = async () => {
    dispatch(fbDeleteUserFB());
  };

  // 로그인 관리 기능 타입
  const callBacksFireBase: CallBacksFireBaseType = {
    fbLogin,
    fbJoin,
    fbLogout,
    fbDeleteUser,
  };

  useEffect(() => {
    getLocalData();
  }, []);

  return (
    <App
      states={states}
      callBacks={callBacks}
      callBacksFireBase={callBacksFireBase}
      userLogin={user.userLogin}
    />
  );
};

export default AppContainer;
