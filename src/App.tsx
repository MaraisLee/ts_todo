import { TodoType } from "./AppContainer";

type IProps = {
  todoList: Array<TodoType>;
  addTodo: (
    title: string,
    body: string,
    date: string,
    sticker: string,
    done: boolean
  ) => void;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
  sortTodo: (sortType: string) => void;
};

function App(props: IProps) {
  return <div className="App">APP</div>;
}

export default App;
