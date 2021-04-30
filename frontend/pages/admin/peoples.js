import Layout from "../../components/layout";
import Head from "next/head";
import Navbar from "../../components/navbar";
import { useEffect, useState } from "react";
import { Row, Form, Table, Input, Modal, Button } from "antd";
import { useRouter } from "next/router";
import axios from "axios";
import config from "../../config/config";
import styles from "../../styles/Home.module.css";
const Peoples = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    id: 0,
  });

  const [user, setUser] = useState({
    address: "",
    fullName: "",
    id: 0,
    passport: "",
    plaints: [],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("admin");
    if (data) {
      setAdmin(JSON.parse(data));
      getusers();
    } else {
      router.push("/");
    }
  }, []);

  const getusers = async () => {
    let result = await axios.get(`${config.URL}/users`, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    });
    setUsers(result.data);
  };

  const go = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    router.push("/admin/list");
  };

  const deleteUser = async (user) => {
    await axios.delete(`${config.URL}/user/` + user.id, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    });
    getusers();
  };

  const columns = [
    {
      title: "Number",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "passport",
      dataIndex: "passport",
      key: "passport",
    },
    {
      title: "fullName",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ation",
      render: (_, data) => (
        <div>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => go(data)}
          >
            รายละเอียด
          </Button>
          <Button type="primary" onClick={() => deleteUser(data)}>
            ลบ
          </Button>
          &ensp;  <Button
            type="primary"
            onClick={() => {
              setUser(data);
              showModal();
              form.setFieldsValue({
                passport: data.passport,
                address: data.address,
                fullName: data.fullName,
              });
            }}
          >
            แก้ไข
          </Button>
        </div>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setUser({ id: 0 });
  };
  const onFinish = async (values) => {
    values.plaints = [];
    if (user.id != 0) {
      await axios.put(
        `${config.URL}/user/` + user.id,
        { ...user, ...values },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
    } else {
      await axios.post(
        `${config.URL}/user`,
        { ...values },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
    }
    getusers();
    handleCancel();
  };

  const logout = () => {
    sessionStorage.clear();
    router.push("/");
  };
  return (
    <div className className={styles.bk3}>
      <Layout>
        <Head>
          <title>List Page</title>
        </Head>
        <Button type="primary" onClick={() => showModal()}>
          ADD
        </Button>
        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        &ensp;&ensp;&ensp;&ensp;&ensp;
        <Button onClick={logout}>Logout</Button>
        <Table columns={columns} dataSource={users} pagination={false} />
        <Modal
          title="User"
          visible={isModalVisible}
          footer={false}
          onCancel={handleCancel}
        >
          <Form id="form" form={form} onFinish={onFinish}>
            <Form.Item name="passport">
              <Input placeholder="หมายเลขบัตรประชาชน" />
            </Form.Item>
            <Form.Item name="fullName">
              <Input placeholder="ชื่อ-นามสกุล" />
            </Form.Item>
            <Form.Item name="address">
              <Input placeholder="ที่อยู่ตามสำเนา" />
            </Form.Item>
            <Button htmlType="submit" type="primary">
              SAVE
            </Button>
          </Form>
        </Modal>
      </Layout>
    </div>
  );
};
export default Peoples;
