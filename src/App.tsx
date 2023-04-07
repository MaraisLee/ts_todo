import * as css from "./styles/style";
import { Button, Modal } from "antd";
import {
  CallBacksFireBaseType,
  CallBacksType,
  StatesType,
} from "./AppContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./pages/Todo";
import NotFound from "./pages/NotFound";
import TodoEdit from "./pages/TodoEdit";
import Login from "./pages/Login";
import Join from "./pages/Join";
import { useState } from "react";
type propsType = {
  states: StatesType;
  callBacks: CallBacksType;
  callBacksFireBase: CallBacksFireBaseType;
  userLogin: Boolean;
};

function App({ states, callBacks, callBacksFireBase, userLogin }: propsType) {
  const path = process.env.PUBLIC_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    callBacksFireBase.fbDeleteUser();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const logoutModal = () => {
    setIsLogoutModalOpen(true);
  };
  const handleLogoutOk = () => {
    setIsLogoutModalOpen(false);
    callBacksFireBase.fbLogout();
  };
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <BrowserRouter>
      <css.Wrapper className="wrap">
        <css.Inner className="inner">
          <css.AppTitle>
            <img src={`${path}/favicon.png`} alt="" width="45px" />
            My Todo App
            {userLogin && (
              <css.ButtonWrap>
                <Button onClick={logoutModal}>로그아웃</Button>
                <Button onClick={showModal}>회원탈퇴</Button>
                <Modal
                  title="회원탈퇴"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>정말로 탈퇴하시겠습니까?</p>
                </Modal>
                <Modal
                  title="로그아웃"
                  open={isLogoutModalOpen}
                  onOk={handleLogoutOk}
                  onCancel={handleLogoutCancel}
                >
                  <p>로그아웃 하시겠습니까?</p>
                </Modal>
              </css.ButtonWrap>
            )}
          </css.AppTitle>
        </css.Inner>
        {/* 라우팅 영역 */}
        <Routes>
          {/* 로그인 화면 */}
          <Route
            path="/login"
            element={
              <Login
                userLogin={userLogin}
                callBacksFireBase={callBacksFireBase}
              />
            }
          />
          {/* 회원가입 */}
          <Route
            path="/join"
            element={
              <Join
                callBacksFireBase={callBacksFireBase}
                userLogin={userLogin}
              />
            }
          />
          {/* 첫화면 : 입력창, 목록창 */}
          <Route
            path="/"
            element={
              <Todo
                states={states}
                callBacks={callBacks}
                userLogin={userLogin}
              />
            }
          />
          {/* 수정화면 : 편집창 */}
          <Route
            path="/edit/:uid"
            element={<TodoEdit states={states} callBacks={callBacks} />}
          />
          {/* 주소오류 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </css.Wrapper>
    </BrowserRouter>
  );
}

export default App;
