import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGoogle, BsGithub } from 'react-icons/bs';
import { loginWithEmailAndPassword, loginWithProvider } from "../../service/supabase";
import Divider from '@mui/material/Divider';
import withLogin from '../../hoc/withLogin';
import "../../style/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async() =>
  {
    await loginWithEmailAndPassword(email,password).then(() =>{
      navigate("/albums", { replace: true })
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
        <button className="access_btn access_github" onClick={() => loginWithProvider("github")}>
          <BsGithub/>
        </button>
        <div className="route_register">
          Non hai un account? <Link to="/register">Registrati</Link> ora.
        </div>
      </div>
    </div>
  );
}

export default withLogin(Login);