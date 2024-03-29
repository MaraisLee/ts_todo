import {
  HighlightOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as css from "../styles/style";
import {
  Input,
  DatePicker,
  Radio,
  Button,
  Space,
  Form,
  notification,
} from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import moment from "moment";

type propsType = {
  addTodo: (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => void;
};

const TodoInput = (props: propsType) => {
  const path = process.env.PUBLIC_URL;
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Notification ${placement}`,
      description: "새로운 내용이 등록 되었습니다.",
      placement,
      duration: 1,
    });
  };
  const [form] = Form.useForm();
  // 내용 입력
  const { TextArea } = Input;

  // 필수 항목 작성시
  const onFinish = (values: any) => {
    openNotification("top");

    const day = moment(values.date.$d).format("YYYY-MM-DD");
    props.addTodo(
      String(new Date().getTime()),
      values.title,
      values.body,
      false,
      values.sticker,
      day
    );
    // 항목 초기화
    form.resetFields();
  };
  // 항목 누락시
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <css.TodoInputWrap>
        {/* Ant.design Form 이용 */}
        <Form
          name="todoform"
          form={form}
          layout="vertical"
          labelCol={{}}
          wrapperCol={{}}
          style={{ maxWidth: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* 제목 */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              size="large"
              placeholder="제목을 입력하세요."
              prefix={<UserOutlined />}
              maxLength={20}
              showCount
            />
          </Form.Item>
          {/* 날짜 */}
          <Form.Item
            label="날짜"
            name="date"
            rules={[{ required: true, message: "날짜를 입력하세요." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* 스티커 선택 */}
          <Form.Item
            label="Sticker"
            name="sticker"
            initialValue={"1"}
            rules={[{ required: true, message: "스티커를 선택하세요." }]}
          >
            <Radio.Group>
              <Radio value={"1"}>
                <img
                  src={`${path}/icon/icon1.png`}
                  alt="sticker"
                  style={{ width: 30, height: 30 }}
                />
              </Radio>
              <Radio value={"2"}>
                {" "}
                <img
                  src={`${path}/icon/icon2.png`}
                  alt="sticker"
                  style={{ width: 30, height: 30 }}
                />
              </Radio>
              <Radio value={"3"}>
                {" "}
                <img
                  src={`${path}/icon/icon3.png`}
                  alt="sticker"
                  style={{ width: 30, height: 30 }}
                />
              </Radio>
              <Radio value={"4"}>
                {" "}
                <img
                  src={`${path}/icon/icon4.png`}
                  alt="sticker"
                  style={{ width: 30, height: 30 }}
                />
              </Radio>
            </Radio.Group>
          </Form.Item>
          {/* 내용 */}
          <Form.Item
            label="Contents"
            name="body"
            rules={[{ required: true, message: "내용을 입력하세요." }]}
          >
            <TextArea
              showCount
              maxLength={100}
              style={{ height: 120, resize: "none" }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space align="center">
              <Button htmlType="reset" icon={<CloseOutlined />}>
                취소
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                icon={<HighlightOutlined />}
              >
                등록
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </css.TodoInputWrap>
    </>
  );
};

export default TodoInput;
