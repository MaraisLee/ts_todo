import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CallBacksFireBaseType } from "../AppContainer";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Space, notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";

type PropsType = {
  callBacksFireBase: CallBacksFireBaseType;
  userLogin: Boolean;
};

const Login = ({ userLogin, callBacksFireBase }: PropsType) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    callBacksFireBase.fbLogin(values.email, values.password);
  };

  // alert 창
  const Context = React.createContext({ name: "Default" });
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: "로그인",
      description: (
        <Context.Consumer>
          {({ name }) => "오늘 하루도 알차게!"}
        </Context.Consumer>
      ),
      placement,
    });
  };
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  useEffect(() => {
    if (userLogin) {
      navigate("/");
    }
  }, [userLogin]);

  return (
    <>
      <div style={{ paddingBottom: 20, margin: "0 50px" }}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Context.Provider value={contextValue}>
              {contextHolder}
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 10 }}
                  onClick={() => openNotification("top")}
                >
                  Log in
                </Button>
                Or <Link to="/join">register now!</Link>
              </Space>
            </Context.Provider>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
