import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../../logo.svg';
import "../../style/Access.css";

function Access() {

  return (
    <div className="access">
      <div className="access_container">
        <div className="access_header">
          <div className="access_logo">
             <Logo/>
          </div>
          <h2><b>Benvenuto su EuroCoins</b></h2>
          <p>EuroCoins è una WebApp in cui puoi tenere traccia della tua collezione di MONETE EURO online.</p>
        </div>
        <Link to="login"><button className="access_btn">Accedi</button></Link>
        <div className="route_register">
          Non hai un account? <Link to="register">Registrati</Link> ora.
        </div>
      </div>
    </div>
  );
}

export default Access;