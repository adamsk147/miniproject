import { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
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
    <div>
      <div>{user.fullName}</div>
      <div>{user.address}</div>
      <div>{user.passport}</div>
    </div>
  );
};

export default Navbar;
