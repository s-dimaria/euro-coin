import React, {useEffect, useState} from "react";
import withProtected from "../hoc/withProtected";
import {Link} from "react-router-dom";
import { getAlbumCommemorative, getAlbumNoComm, getUserInfo, logout, sendPasswordReset } from "../service/supabase";
import '../style/User.css';

function User() {


  const user = getUserInfo();
  const [coinEuro, setCoinEuro] = useState([]);
  const [coinComm, setCoinComm] = useState([]);


  useEffect (() => {

     async function fetchCoin() {
        setCoinEuro(await getAlbumNoComm(getUserInfo().id));
        setCoinComm(await getAlbumCommemorative(getUserInfo().id));
     }
     fetchCoin()
  }, [])

    return (
        <div className="wrapperCard">
            <div className="cardUser">
                <div className="row">
                    <div className="col image">
                        <img src={user.user_metadata.avatar_url}></img>
                    </div>
                    <div className="col">
                        <p>Utente: {user.user_metadata.name}</p>
                    </div>
                    <div className="col">
                        <p>Email: {user.email}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col buttonBox">
                        <button onClick={()=>{
                            if(window.confirm("Reimpostare password?")) {
                            sendPasswordReset(user.email);
                            alert("Email inviata per reset password") }
                            
                            }}>Modifica Password</button>
                        <div className="deleteBtn">
                            <Link to="/"><button onClick={() => logout()}>Esci</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="rowBox"> */}
            <div className="cardUser">
                <div className="row">
                    <div className="col">
                        <span>La tua collezione</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Euro: {coinEuro.length}</p>
                    </div>
                    <div className="col">
                        <p>Commemorative: {coinComm.length}</p>
                    </div>
                </div>
            </div>
            {/* </div> */}

        </div>
    )

}

export default withProtected(User);