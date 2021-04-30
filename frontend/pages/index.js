import Head from "next/head";
import Layout from "../components/layout";
import axios from "axios";
import React from "react";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import { message } from "antd";
import { Menu, Breadcrumb } from "antd";
import styles from "../styles/Home.module.css";

const index = () => {
  const router = useRouter();
  const onFinish = async (values) => {
    const res = await axios.get(
      "http://localhost/api/getuser/" + values.passport
    );
    if (res.data.text) {
      message.error("ไม่พบข้อมูล");
    } else {
      sessionStorage.setItem("user", JSON.stringify(res.data));
      router.push("/list");
    }
  };
  return (
    <div className={styles.bk}>
      <Layout>
        <Head>
          <title>Home Page</title>
        </Head>

        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item
            key="1"
            onClick={() => {
              router.push("/admin");
            }}
          >
            admin
          </Menu.Item>
        </Menu>
        <div className={styles.title}>
          <marquee
            bgcolor="# 00FFFF"
            direction="lefe"
            scrollamount="2"
            width="100%"
          >
            <ins> ยินดีต้อนรับเข้าสู้ระบบตรวจสอบการกระทำผิดกฎจราจร &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;      Welcome to the immoral inspection system</ins>
          </marquee>
        </div > 
        <Form onFinish={onFinish}>
          <Form.Item name="passport">
            <Input placeholder="เลขบัตร" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            ค้นหา
          </Button>
        </Form>
      </Layout>
      <div>///</div>
    </div>
  );
};
export default index;
