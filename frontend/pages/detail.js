import Layout from "../components/layout";
import Head from "next/head";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
const Detail = () => {
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

  return (
    <Layout>
      <Head>
        <title>Detail Page</title>
      </Head>
      <Navbar />
      {user.plaints.map((item) => {
        return (
          <div>
            <div>{item.id}</div>
            <div>{item.price}</div>
            <div>{item.title}</div>
            <div>{item.status}</div>
            <div>{item.vehicle}</div>
            {item.status && (
              <>
                <div>0jkpc]h;</div>
                <img
                  src={"http://localhost/api/upload/" + item.img}
                  height="200"
                />
              </>
            )}
            {!item.status && (
              <>
                <div>ยังไม่จ่าย</div>
              </>
            )}
          </div>
        );
      })}
    </Layout>
  );
};
export default Detail;
