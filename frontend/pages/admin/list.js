import Layout from "../../components/layout";
import Head from "next/head";
import Navbar from "../../components/navbar";
import { useEffect, useState } from "react";
import { Row, Modal, Form, Table, Input, Button } from "antd";
import { useRouter } from "next/router";
import axios from "axios";
import config from "../../config/config";
import styles from "../../styles/Home.module.css";
const Detail = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [user, setUser] = useState({
    address: "",
    fullName: "",
    id: 0,
    passport: "",
    plaints: [],
  });
  const [plaint, setplaint] = useState({
    id: 0,
    img: "",
    price: 100,
    status: false,
    title: "",
    vehicle: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, []);

  const go = (data) => {
    sessionStorage.setItem("plaint", JSON.stringify(data));
    router.push("/admin/detail");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setplaint({ id: 0 });
  };

  const onFinish = async (values) => {
    if (plaint.id != 0) {
      await axios.put(
        `${config.URL}/user/` + user.passport + "/" + plaint.id,
        { ...plaint, ...values },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
    } else {
      await axios.post(
        `${config.URL}/user/` + user.id,
        { ...values },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      );
    }
    getuser(user);
    handleCancel();
  };

  const columns = [
    {
      title: "Number",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "vehicle",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (status) => <div>{status ? "จ่ายแล้ว" : "ไม่จ่ายตัง"}</div>,
    },
    {
      title: "Ation",
      render: (_, data) => (
        <div>
          <Button type="primary" onClick={() => go(data)}>
            รายละเอียด
          </Button>
          &ensp; <Button type="primary" onClick={() => deletePlaint(data)}>
            ลบ
          </Button>
          &ensp;  <Button
            type="primary"
            onClick={() => {
              setplaint(data);
              showModal();
              form.setFieldsValue({
                price: data.price,
                title: data.title,
                vehicle: data.vehicle,
              });
            }}
          >
            แก้ไข
          </Button>
        </div>
      ),
    },
  ];
  const deletePlaint = async (plaint) => {
    await axios.delete(
      `${config.URL}/user/` + user.passport + "/" + plaint.id,
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    getuser(user);
  };
  const getuser = async (values) => {
    const res = await axios.get(
      "http://localhost/api/getuser/" + values.passport
    );
    setUser(res.data);
    sessionStorage.setItem("user", JSON.stringify(res.data));
  };
  return (
    <div className className={styles.bk2}>
    <Layout>
      <Head>
        <title>List Page</title>
      </Head>
      <Navbar />
      <Button type="primary" onClick={() => showModal()}>
        ADD
      </Button>
      <Table columns={columns} dataSource={user.plaints} pagination={false} />
      <Modal
        title="Plaint"
        visible={isModalVisible}
        footer={false}
        onCancel={handleCancel}
      >
        <Form id="form" form={form} onFinish={onFinish}>
          <Form.Item name="title">
            <Input placeholder="ข้อหา" />
          </Form.Item>
          <Form.Item name="price">
            <Input placeholder="ค่าปรับ" />
          </Form.Item>
          <Form.Item name="vehicle">
            <Input placeholder="รายละเอียดยานพาหนะ" />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            บันทึก
          </Button>
        </Form>
      </Modal>
    </Layout>
    </div>
  );
};
export default Detail;
