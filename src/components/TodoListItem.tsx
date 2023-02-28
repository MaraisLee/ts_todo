import { TodoType } from "../AppContainer";
import { Space, Button, List } from "antd";

type propsType = {
  todoItem: TodoType;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
};

const TodoListItem = (props: propsType) => {
  return (
    <List.Item>
      <Space>
        {props.todoItem.title}
        {props.todoItem.body}
        {props.todoItem.date}
        {props.todoItem.title}
      </Space>
      <Space>
        <Button >수정</Button>
        <Button type="primary" danger >삭제</Button>
      </Space>
    </List.Item>
  );
};

export default TodoListItem;
