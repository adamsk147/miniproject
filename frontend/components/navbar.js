import { useEffect, useState } from "react";
import { Layout, Menu, Row, Col } from "antd";
import { useRouter } from "next/router";
const { Header, Content, Sider } = Layout;
const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, []);
  return (
    <Row>
      <Col span={8}>ชื่อ : {user.fullName}</Col>
      <Col span={8}>ที่อยู่ : {user.address}</Col>
      <Col span={8}>เลขบัตร : {user.passport}</Col>
    </Row>
  );
};

export default Navbar;
