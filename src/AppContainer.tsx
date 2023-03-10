import { auth, fireDB } from "./firebase";
import { useEffect, useState } from "react";
// 상태관리를 위한 객체복사 라이브러리
import produce from "immer";
import App from "./App";
import moment from "moment";
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
  signInWithEmailAndPassword,
} from "firebase/auth";

export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};

// 사용함수 모음집
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
  // 있을수도 없을수도
  clearTodo?: () => void;
};
// 데이터 목록의 type
export type StatesType = {
  todoList: Array<TodoType>;
};

const AppContainer = () => {
  // 상태데이터
  let initData: Array<TodoType> = [];
  // 로컬스토리지 이름
  // const localStorageName = "tstodo";

  // firebase Storage 이름
  const firebaseStorageName = "tsmemo";
  // 컬렉션(DB 단위:  MongoDB) 불러오기
  const memoCollectionRef = collection(fireDB, firebaseStorageName);

  // 로컬스토리지 활용 => fb 로 변경
  const getLocalData = async () => {
    // const data = localStorage.getItem(localStorageName);
    const q = await query(memoCollectionRef);
    const data = await getDocs(q);
    // console.log("fb clt", data);

    if (data !== null) {
      // initData = JSON.parse(data);
      // 모든 데이터 가져와서 뜯기
      const firebaseData = data.docs.map((doc) => ({
        ...doc.data(),
      }));
      const initData = firebaseData.map((item) => {
        // fb 에서 가져온 데이터를
        // 우리가 만든 Type 으로 변환하기 (as 사용)
        return item as TodoType;
      });
      // setTodoList(Array<TodoType>); 형태를 원했다.
      setTodoList(initData);
    }
  };

  // 화면의 내용을 갱신해 주기 위해서 state Hook 사용
  const [todoList, setTodoList] = useState<Array<TodoType>>(initData);

  // 추가기능
  const addTodo = async (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => {
    // fb 에 쓰기
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

    // Immer 사용
    let newTodoList = produce(todoList, (draft) => {
      draft.push({
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      });
    });
    // state 업데이트 : 화면 갱신
    setTodoList(newTodoList);
    // localStorage.setItem(localStorageName, JSON.stringify(newTodoList));
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

    // 1. 먼저 uid 를 비교해서 배열의 순서에 맞는 1개를 찾는다.
    const index = todoList.findIndex((item) => item.uid === todo.uid);
    // 2. 해당하는 uid 의 내용을 갱신한다.
    const newTodoList = produce(todoList, (draft) => {
      draft[index] = {
        ...draft[index],
        title: todo.title,
        body: todo.body,
        date: moment(todo.date).format("YYYY-MM-DD"),
        sticker: todo.sticker,
        done: todo.done,
      };
    });
    // 3. state를 업데이트한다.
    setTodoList(newTodoList);
    // localStorage.setItem(localStorageName, JSON.stringify(newTodoList));
  };
  // 삭제기능
  const deleteTodo = async (todo: TodoType) => {
    const userDoc = doc(fireDB, firebaseStorageName, todo.uid);
    try {
      const res = await deleteDoc(userDoc);
      console.log(res); // res는 undefined
    } catch (e) {
      console.log(e);
    } finally {
      console.log("end");
    }
    let index = todoList.findIndex((item) => todo.uid === item.uid);
    // state 의 목록을 삭제 후 갱신한다. 불변성 라이브러리 (immer) 활용
    // let newTodoList = produce( 대상, (draft) => {})
    let newTodoList = produce(todoList, (draft) => {
      // index 의 순서로 부터 1개를 제거하고
      // 나머지 배열을 리턴한다.
      // 즉, 원본을 복사해서 새로운 배열을 만들고 그 중에 1개를 제거한후
      // 새로운 배열을 리턴하여 state 를 업데이트 한다.
      draft.splice(index, 1);
    });
    setTodoList(newTodoList);
    // localStorage.setItem(localStorageName, JSON.stringify(newTodoList));
  };
  // 전체 목록 삭제
  const clearTodo = () => {
    setTodoList([]);

    todoList.forEach(async (element) => {
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

    // localStorage.removeItem(localStorageName);
  };

  // 정렬기능
  const sortTodo = (sortType: string) => {};
  // state 관리기능 type
  const callBacks: CallBacksType = {
    addTodo,
    updateTodo,
    deleteTodo,
    sortTodo,
    clearTodo,
  };

  // 데이터목록
  const states: StatesType = { todoList };

  // 사용자 기능
  //  회원가입
  const faJoin = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errCode : ", errorCode);
        console.log("errMessage : ", errorMessage);
      });
  };
  // 로그인
  const fbLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errCode : ", errorCode);
        console.log("errMessage : ", errorMessage);
      });
  };

  useEffect(() => {
    getLocalData();
  }, []);

  return <App states={states} callBacks={callBacks} />;
};

export default AppContainer;
