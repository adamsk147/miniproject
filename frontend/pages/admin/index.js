import Head from "next/head";
import Layout from "../../components/layout";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import config from "../../config/config";
import { useRouter } from "next/router";
export default function Login({ token }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const login = async (req, res) => {
    try {
      let result = await axios.post(
        `${config.URL}/login`,
        { username, password, remember }
      );
      console.log("result: ", result);
      console.log("result.data:  ", result.data);
      console.log("token:  ", token);
      sessionStorage.setItem("admin", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      router.push('/admin/peoples')
    } catch (e) {
      console.log("error: ", JSON.stringify(e.response));
    }
  };
  const reMem = async () => {
    setRemember(!remember);
  };
  const register = () =>{
    router.push('/admin/register')
  }

  const loginForm = () => (
    <div className={styles.gridContainer}>
      <div>
        <b>Username:</b>
      </div>
      <div>
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <b>Password:</b>
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <input
          id="remember_me"
          name="remember_me"
          type="checkbox"
          onClick={reMem}
        />
      </div>
      <div className={styles.text}>
        <label>
          <ins>
            <i>
              <b>Remember Me</b>
            </i>
          </ins>
        </label>
      </div>
    </div>
  );

  const copyText = () => {
    navigator.clipboard.writeText(token);
  };

  return (
    <Layout>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className={styles.container}>
        
        <h1 className ={styles.text}>ยินดีต้องรับการเข้าสู้ระบบ</h1>
   
        
        <br />
        <br />
        {loginForm()}
        <div>
          <button className={styles.btn2} onClick={login}>
            Login
          </button>
        </div>
        <button className={styles.btn2} onClick={register}>
            register
          </button>
      </div>
      
    </Layout>
  );
}

export function getServerSideProps({ req, res }) {
  return { props: { token: req.cookies.token || "" } };
}
