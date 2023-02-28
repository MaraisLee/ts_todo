import * as css from "../styles/style";
import { TodoType } from "../AppContainer";
import {
  UserOutlined,
  HighlightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { DatePickerProps, RadioChangeEvent } from "antd";
import {
  DatePicker,
  Space,
  Input,
  Radio,
  Button,
  Divider,
  Row,
  Tooltip,
} from "antd";
import { useState } from "react";

type propsType = {
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
};

const TodoInput = (props: propsType) => {
  const onChangeDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  // 스티커
  const [stickerValue, setStickerValue] = useState(1);

  const onChangeSticker = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setStickerValue(e.target.value);
  };
  // 내용입력
  const { TextArea } = Input;
  const onChangeBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Change:", e.target.value);
  };
  return (
    <css.TodoInputWrap>
      <Divider orientation="left">제목</Divider>
      <Tooltip title="제목 입력" placement="topLeft">
        <Input
          size="large"
          placeholder="large size"
          prefix={<UserOutlined />}
        />
      </Tooltip>
      <Divider />
      <Divider orientation="left">날짜</Divider>
      <DatePicker onChange={onChangeDate} style={{ width: "100%" }} />
      <Divider />
      <Divider orientation="left">스티커</Divider>
      <Radio.Group onChange={onChangeSticker} value={stickerValue}>
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
      </Radio.Group>
      <Divider />
      <Divider orientation="left">내용</Divider>

      <TextArea
        showCount
        maxLength={100}
        style={{ height: 120, resize: "none" }}
        onChange={onChangeBody}
        placeholder="disable resize"
      />
      <Divider orientation="left"></Divider>
      <Row justify="center">
        <Space>
          <Button icon={<CloseOutlined />}>취소</Button>

          <Button type="primary" icon={<HighlightOutlined />}>
            추가
          </Button>
        </Space>
      </Row>
    </css.TodoInputWrap>
  );
};

export default TodoInput;
