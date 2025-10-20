import React from "react";
import { Modal, Form, Input, Checkbox, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export type LoginValues = {
  username: string;
  password: string;
  remember?: boolean;
};

type Props = {
  open: boolean;
  title?: string;
  onCancel: () => void;
  onLogin: (values: LoginValues) => void;
};

const ModalLogin: React.FC<Props> = ({
  open,
  title = "เข้าสู่ระบบ",
  onCancel,
  onLogin,
}) => {
  const [form] = Form.useForm<LoginValues>();
  const [submitting, setSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginValues) => {
    try {
      setSubmitting(true);

      const raw = values.username?.trim() || "";
      const username = raw.includes("@") ? raw.toLowerCase() : raw;

      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        { username, password: values.password },
        { timeout: 10000 }
      );

      const { accessToken, user } = data || {};
      if (!accessToken) throw new Error("ไม่พบ access token จากเซิร์ฟเวอร์");

      const storage = values.remember ? localStorage : sessionStorage;
      storage.setItem("accessToken", accessToken);
      storage.setItem("user", JSON.stringify(user ?? null));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      message.success("เข้าสู่ระบบสำเร็จ 🎉", 1);
      onLogin(values);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      let msg = "เข้าสู่ระบบไม่สำเร็จ";
      if (axios.isAxiosError(err)) {
        msg =
          (err.response?.data as { error?: string } | undefined)?.error ||
          err.message ||
          msg;
      } else if (err instanceof Error) {
        msg = err.message || msg;
      }
      message.error(msg, 2);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      centered
      footer={null}
      destroyOnClose
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ System HR
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="อีเมลหรือชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: "กรุณากรอกอีเมลหรือชื่อผู้ใช้" }]}
          >
            <Input placeholder="your@email.com หรือ username" size="large" />
          </Form.Item>

          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>จดจำฉันไว้ในระบบ</Checkbox>
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
              loading={submitting}
              disabled={submitting}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalLogin;
