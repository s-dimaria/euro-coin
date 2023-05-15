import React, { useEffect, useState } from "react";
import { getStates } from "../service/supabase";
import { Link } from "react-router-dom";
import withProtected from "../hoc/withProtected";
import LoadingAlbum from "../info/LoadingAlbum";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../service/supabase";
import "../style/Home.css";

function Home() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      setLoading(true);
      const json = await getStates();
      if (!ignore) {
        console.info("Done");
        setStates(json);
        console.log(json);
      }
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingAlbum />
      ) : (
        <div className="container-centered">
          <div className="container">
            <div className="centered-text">
              <IconButton>
                <InfoIcon />
              </IconButton>
              <h1>I tuoi album</h1>
              <Link to="/">
                <IconButton onClick={() => logout()}>
                  <LogoutIcon />
                </IconButton>
              </Link>
            </div>
            <div className="bookshelf">
              {Object.keys(states)
                .sort((a, b) =>
                  states[a].state_name > states[b].state_name ? 1 : -1
                )
                .map((element) => {
                  return (
                    <Link to={`${states[element].state_name}`}>
                      <div id={states[element].prefix} className="album">
                        <div className="side spine">
                          <span className="spine-title">
                            {states[element].state_name}
                          </span>
                          <span className="spine-author">
                            <span className="spine-img">
                              <img src={states[element].flagUrl} alt=""></img>
                            </span>
                            {states[element].prefix}
                          </span>
                        </div>
                        <div className="side top"></div>
                        <div className="side cover"></div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default withProtected(Home);
