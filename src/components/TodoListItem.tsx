import { Button, List, Space, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { TodoType } from "../AppContainer";

type propsType = {
  todoItem: TodoType;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
};

const TodoListItem = (props: propsType) => {
  const path = process.env.PUBLIC_URL;
  // 웹브라우저 라우팅
  const navigate = useNavigate();
  // 모달
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("내용을 삭제하시겠습니까?");
  const handleOk = () => {
    setModalText("삭제되었습니다.");
    // 실제내용삭제
    props.deleteTodo(props.todoItem);
    setConfirmLoading(true);
    // 한번만 실행 (setInterval: 반복적으로 실행)
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1500);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const lineThrough = {
    textDecoration: "line-through",
  };
  return (
    <>
      <List.Item>
        <Space style={props.todoItem.done ? lineThrough : {}}>
          {
            <div style={{ border: "2px solid black", padding: 5 }}>
              {props.todoItem.title}
            </div>
          }
          {props.todoItem.body}

          {
            <img
              src={`${path}/icon/icon${props.todoItem.sticker}.png`}
              alt="sticker"
              style={{ width: 30, height: 30 }}
            />
          }
        </Space>
        <Space>
          {props.todoItem.done ? (
            <>완료</>
          ) : (
            <div style={{ color: "red" }}>진행중</div>
          )}
          {props.todoItem.date}
          <Button onClick={() => navigate(`/edit/${props.todoItem.uid}`)}>
            수정
          </Button>
          <Button type="primary" danger onClick={showModal}>
            삭제
          </Button>
        </Space>
      </List.Item>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default TodoListItem;
