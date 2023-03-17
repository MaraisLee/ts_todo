import { useEffect } from "react";
import App from "./App";
import moment from "moment";
// firebase 관련
import { fireDB, auth } from "./firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
// 로그인 관리 action
import {
  fbLoginState,
  fbLogoutState,
  fbDeleteUserState,
} from "./store/userSlice";

// todo 목록 관리 action
import {
  initTodoState,
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
} from "./store/todoSlice";

export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};
// 상태를 변경하는 함수를 묶어서 타입으로 정의해 볼까?
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
  // store 사용
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const todo = useSelector((state: RootState) => state.todo);

  // 로컬스토리지 활용 : 파이어베이스로 변경
  const getLocalData = async () => {
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
      dispatch(initTodoState(initData));
    }
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
    // firebase 에 쓰기
    try {
      const res = await setDoc(doc(fireDB, firebaseStorageName, uid), {
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      });
      // console.log(res); // res는 undefined입니다.
    } catch (e) {
      console.log(e);
    }
    const tempTodo: TodoType = {
      uid: uid,
      title: title,
      body: body,
      date: date,
      sticker: sticker,
      done: false,
    };
    dispatch(addTodoState(tempTodo));
  };

  // 수정기능
  const updateTodo = async (todo: TodoType) => {
    // 원하는 데이터 가져옴
    const userDoc = doc(fireDB, firebaseStorageName, todo.uid);
    try {
      const res = await updateDoc(userDoc, {
        title: todo.title,
        body: todo.body,
        sticker: todo.sticker,
        done: todo.done,
        date: moment(todo.date).format("YYYY-MM-DD"),
      });
      console.log(res); // res는 undefined
    } catch (e) {
      // console.log(e);
    } finally {
      // console.log("end");
    }
    const tempTodo: TodoType = {
      uid: todo.uid,
      title: todo.title,
      body: todo.body,
      sticker: todo.sticker,
      done: todo.done,
      date: moment(todo.date).format("YYYY-MM-DD"),
    };
    dispatch(updateTodoState(tempTodo));
  };

  // 삭제기능
  const deleteTodo = async (todo: TodoType) => {
    // firebase 데이터 1개 삭제
    const userDoc = doc(fireDB, firebaseStorageName, todo.uid);
    try {
      const res = await deleteDoc(userDoc);
      // console.log(res); // res는 undefined
    } catch (e) {
      console.log(e);
    } finally {
      console.log("end");
    }
    dispatch(deleteTodoState(todo));
  };

  // 전체 목록 삭제
  const clearTodo = () => {
    todo.todoList.forEach(async (element) => {
      // firebase 데이터 1개 삭제
      const userDoc = doc(fireDB, firebaseStorageName, element.uid);
      try {
        const res = await deleteDoc(userDoc);
        // console.log(res); // res는 undefined
      } catch (e) {
        console.log(e);
      } finally {
        console.log("end");
      }
    });
    dispatch(clearTodoState());
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
  // 기존 {todoList:todoList} => {todoList}
  const states: StatesType = { todoList: todo.todoList };

  // 사용자 가입
  const fbJoin = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode : ", errorCode);
        console.log("errorMessage : ", errorMessage);
      });
  };
  // 사용자 로그인 기능
  const fbLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        dispatch(fbLoginState({ email, password }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode : ", errorCode);
        console.log("errorMessage : ", errorMessage);
      });
  };

  // 사용자 로그아웃
  const fbLogout = () => {
    auth.signOut();
    dispatch(fbLogoutState());
  };
  // 회원탈퇴
  const fbDeleteUser = async () => {
    await deleteUser(auth.currentUser as User)
      .then(() => {
        // User deleted.
        dispatch(fbDeleteUserState());
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log("회원 탈퇴 실패");
      });
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
