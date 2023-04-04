import styled from "@emotion/styled";
// 전체 레이아웃
export const Wrapper = styled.div`
  position: realtive;
  max-width: 560px;
  margin: 0 auto;
  margin-top: 50px;
  background: #fff;
`;
// 공통레이아웃
export const Inner = styled.div`
  padding: 30px;
`;
// 앱 타이틀
export const AppTitle = styled.div`
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
  font-weight: 600;
  color: #1b75c9;
`;

export const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 15px;
`;

export const TodoInputWrap = styled.div`
  width: 95%;
  margin: 0 auto;
`;

// 목록창
export const TodoListWrap = styled.div`
  width: 95%;
  margin: 50px auto;
  padding-bottom: 50px;
`;
