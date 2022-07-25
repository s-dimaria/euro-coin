import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
// import { signInWithGoogle, signInWithFacebook } from "../service/firebase";
import { BsGoogle } from 'react-icons/bs';
import { ImFacebook } from 'react-icons/im';
import Divider from '@mui/material/Divider';
import "../style/Login.css";

import { loginWithEmailAndPassword, loginWithProvider, getLoginUser } from "../service/supabase";

import withLogin from '../hoc/withLogin';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(getLoginUser());

  const navigate = useNavigate();

  // useEffect(() => {
  //   if(user) navigate("/home");
  // }, [user])

  const login = async() =>
  {
    await loginWithEmailAndPassword(email,password).then(() =>{
      navigate("/home", { replace: true })
    })
  }

  return (
    <div className="login">
      <div className="login_container">
        <input
          type="text"
          className="login_textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          className="login_textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login_btn"
          onClick={login}
        >
          Accedi
        </button>
        <div className="route_resetPws">
          <Link to="/reset">Password dimenticata?</Link>
        </div>
        <Divider>o accedi con</Divider>
        <button className="access_btn access_google" onClick={() => loginWithProvider("google")}>
          <BsGoogle/>
        </button>
        <button className="access_btn access_facebook" onClick={() => loginWithProvider("facebook")}>
          <ImFacebook/>
        </button>
        <div className="route_register">
          Non hai un account? <Link to="/register">Registrati</Link> ora.
        </div>
      </div>
    </div>
  );
}

export default withLogin(Login);