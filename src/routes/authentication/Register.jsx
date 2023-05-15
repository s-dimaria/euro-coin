import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword } from "../../service/supabase";
import "../../style/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    if(!name ||
      !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)
    )
      alert("Dati invalidi");
    else await registerWithEmailAndPassword(name, email, password).then(() => {
        navigate("/login", { replace: true });
      });
  };

  return (
    <div className="register">
      <div className="register_container">
        <input
          type="text"
          className="register_textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          className="register_textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          className="register_textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register_btn" onClick={register}>
          Registrati
        </button>
        <div className="route_login">
          Hai già un account? <Link to="/">Accedi</Link> ora.
        </div>
      </div>
    </div>
  );
}

export default Register;
