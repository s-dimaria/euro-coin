import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "../../service/supabase";
import withLogin from '../../hoc/withLogin';
import "../../style/Reset.css";

function Reset() {
  const [email, setEmail] = useState("");

  return (
    <div className="reset">
      <div className="reset_container">
        <input
          type="text"
          className="reset_textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <button 
          disabled={!(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email))}
          className="reset_btn"
          onClick={(e) => sendPasswordReset(email)}
        >
          Ripristina password
        </button>
        <div className="route_register">
          Non hai un account? <Link to="/register">Registrati</Link> ora.
        </div>
      </div>
    </div>
  );
}

export default withLogin(Reset);