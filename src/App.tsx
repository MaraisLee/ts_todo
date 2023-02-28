import * as css from "./styles/style";
import { TodoType } from "./AppContainer";

import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { DollarOutlined } from "@ant-design/icons";

type propsType = {
  todoList: Array<TodoType>;
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
};

function App(props: propsType) {
  return (
    <css.Wrapper className="App">
      <css.Inner className="inner">
        <css.AppTitle>
          <DollarOutlined /> TodoList App
        </css.AppTitle>
      </css.Inner>
      <TodoInput
        addTodo={props.addTodo}
        updateTodo={props.updateTodo}
        deleteTodo={props.deleteTodo}
      />
      <TodoList
        todoList={props.todoList}
        updateTodo={props.updateTodo}
        deleteTodo={props.deleteTodo}
      />
    </css.Wrapper>
  );
}

export default App;
