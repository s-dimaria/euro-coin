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
  const [loading, setLoading] = useState(true); // Inizializza a true
  const [states, setStates] = useState(null); // Inizializza a null invece di array vuoto

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      const json = await getStates();
      if (!ignore) {
        setStates(json || {}); // Assicurati che sia un oggetto
        setLoading(false);
      }
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading || !states) {
    return <LoadingAlbum />;
  }

  return (
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
              states[a].state_name.localeCompare(states[b].state_name)
            )
            .map((element) => {
              const state = states[element];
              const prefix = state?.prefix?.toLowerCase() || '';
              
              return (
                <Link key={element} to={`${state.state_name}`}>
                  <div id={state.prefix} className="album">
                    <div className="side spine">
                      <span className="spine-title">{state.state_name}</span>
                      <span className="spine-author">
                        {prefix && (
                          <span className={`spine-img fi fi-${prefix}`} />
                        )}
                        {state.prefix}
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
  );
}

export default withProtected(Home);