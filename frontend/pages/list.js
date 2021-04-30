import Layout from "../components/layout";
import Head from "next/head";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { Row, Col, Table, Tag, Space, Button } from "antd";
import styles from "../styles/Home.module.css";

import { useRouter } from "next/router";
const Detail = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    address: "",
    fullName: "",
    id: 0,
    passport: "",
    plaints: [],
  });

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
    router.push("/detail");
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
      render: (status) => <div>{status ? "จ่ายค่าปรับแล้ว" : "ยังไม่ได้ชำระค่าปรับ"}</div>,
    },
    {
      title: "Ation",
      render: (_, data) => (
        <Button type="primary" onClick={() => go(data)}>
          รายละเอียด
        </Button>
      ),
    },
  ];
  return ( <div className className={styles.bk2}>
    <Layout>
      <Head>
        <title>List Page</title>
      </Head>

      <div >
      <Navbar />
      <Table columns={columns} dataSource={user.plaints} pagination={false} />

      </div>
    </Layout>
    </div>
  );
};
export default Detail;
