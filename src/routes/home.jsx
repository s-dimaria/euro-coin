import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoAlbum } from '../logo.svg';
import { ReactComponent as LogoCoin } from '../coin.svg';
import withProtected from "../hoc/withProtected";
import "../style/Home.css";
import User from '../component/User';


function Home() {

  return (
    <div className="center">
      <div className="userBox">
        <div className="accessPageUser">
          <div className="userInfoBox">
            <User />
          </div>
        </div>
      </div>
      <div className="wrapper_accessPage">
        <div className="accessPage">
          <div className="accessPage_container">
            <div className="accessPage_header">
              <div className="accessPage_logo">
                <LogoCoin />
              </div>
              <h2><b>Monete</b></h2>
              <p>Qui trovi le facce delle diverse monete euro in circolazione nei diversi Stati Europei.</p>
            </div>
            <Link to="/app/coin"><button className="accessPage_btn">Naviga</button></Link>
          </div>
        </div>
        <div className="accessPage">
          <div className="accessPage_container">
            <div className="accessPage_header">
              <div className="accessPage_logo">
                <LogoAlbum />
              </div>
              <h2><b>Album</b></h2>
              <p>Qui inizia a collezionare le tue monete nel tuo album online di monete euro.</p>
            </div>
            <Link to="/app/album"><button className="accessPage_btn">Naviga</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProtected(Home);