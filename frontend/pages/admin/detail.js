import Head from "next/head";
import Layout from "../../components/layout";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";
import { Button, Form, Input } from "antd";
import { message } from "antd";
import { Menu, Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import styles from "../../styles/Home.module.css";

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
  const [Faultbase, กำหนดข้อหา] = useState({
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
      "http://localhost/api/pay/" + user.passport + "/" + Faultbase.id,
      bodyFormData
    );

    sessionStorage.setItem("user", JSON.stringify(res.data));
    router.push("/list");
  };

  const onChange = (file) => {
    setFile(file);
  };

  return (
    <div className className={styles.bk1}>
      <Layout>
        <Head>
          <title>Detail Page</title>
        </Head>
        <Navbar />
        <div align="center"className={styles.bk1} >
          <br></br>
          
          <h3>
            คดีที่: {Faultbase.id}&ensp; ข้อหา: {Faultbase.title}&ensp;<br></br>
            ป้ายทะเบียงรถ: {Faultbase.vehicle}
            {Faultbase.price}&ensp;&ensp;
            <br></br>
            <br></br>
            {Faultbase.status
              ? "ชำระค่าปรับเรียบร้อยแล้ว"
              : "ยังไม่ได้ชำระค่าปรับ"}
          </h3>

          {Faultbase.status ? (
            <img
              src={"http://localhost/api/upload/" + Faultbase.img}
              width="300"
              height="250"
            />
          ) : (
            <div>
              <Form onFinish={onFinish}>
                <Form.Item name="file">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onChange(event.target.files[0] || null)
                    }
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  ส่งสลิป
                </Button>
              </Form>
              <img
                src="/qr.jpg"
                alt="Girl in a jacket"
                width="300"
                height="250"
              />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Detail;
