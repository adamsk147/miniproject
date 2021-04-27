import Head from "next/head";
import Layout from "../components/layout";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";
import { Button, Form, Input } from "antd";
import { message } from "antd";
import { Menu, Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
const Detail = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    address: "",
    fullName: "",
    id: 0,
    passport: "",
    plaints: [],
  });
  const [file, setFile] = useState({});
  const [ข้อหา, กำหนดข้อหา] = useState({
    id: 0,
    img: "",
    price: 100,
    status: false,
    title: "",
    vehicle: "",
  });

  useEffect(() => {
    const data = sessionStorage.getItem("user");
    const tempข้อหา = sessionStorage.getItem("plaint");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      router.push("/");
    }
    if (tempข้อหา) {
      กำหนดข้อหา(JSON.parse(tempข้อหา));
    }
  }, []);

  const onFinish = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append("file", file);
    const res = await axios.put(
      "http://localhost/api/pay/" + user.passport + "/" + ข้อหา.id,
      bodyFormData
    );

    sessionStorage.setItem("user", JSON.stringify(res.data));
    router.push("/list");
  };

  const onChange = (file) => {
    setFile(file);
  };

  return (
    <Layout>
      <Head>
        <title>Detail Page</title>
      </Head>
      <Navbar />
      <div>
        {ข้อหา.id}
        {ข้อหา.title}
        {ข้อหา.vehicle}
        {ข้อหา.price}
        {ข้อหา.status ? "จ่ายแล้ว" : "ไม่จ่ายตัง"}
        {ข้อหา.status ? (
          <img
            src={"http://localhost/api/upload/" + ข้อหา.img}
            width="50"
            height="50"
          />
        ) : (
          <Form onFinish={onFinish}>
            <Form.Item name="file">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => onChange(event.target.files[0] || null)}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              ส่งสลิป
            </Button>
          </Form>
        )}
      </div>
    </Layout>
  );
};

export default Detail;
