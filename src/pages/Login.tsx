import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CallBacksFireBaseType } from "../AppContainer";

// store 관련
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "../store/counterSlice";
import type { RootState } from "../store/store";

type PropsType = {
  callBacksFireBase: CallBacksFireBaseType;
  userLogin: Boolean;
};

const Login = ({ userLogin, callBacksFireBase }: PropsType) => {
  // store 사용
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    callBacksFireBase.fbLogin(values.email, values.password);
  };

  useEffect(() => {
    if (userLogin) {
      navigate("/");
    }
  }, [userLogin]);

  return (
    <div style={{ paddingBottom: 20, margin: "0 50px" }}>
      {/* store 테스트 코드 */}
      <div>
        <button onClick={() => dispatch(decrement())}>감소</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>증가</button>
        <button onClick={() => dispatch(incrementByAmount(100))}>
          100증가
        </button>
      </div>
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
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            Log in
          </Button>
          Or <Link to="/join">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
