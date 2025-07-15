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
import InfoAlbum from "../info/InfoAlbum";

function Home() {
  const [loading, setLoading] = useState(true); // Inizializza a true
  const [states, setStates] = useState(null); // Inizializza a null invece di array vuoto
  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      setLoading(true);
      const json = await getStates();
      if (!ignore) {
        setStates(json);
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

  const handleOpen = () => {
    setOpenInfo(true);
  }

  const handleClose = () => {
    setOpenInfo(false);
  }

  if (loading) {
    return <LoadingAlbum />;
  }

  return (
    <>
      {loading ? (
        <LoadingAlbum />
      ) : (
        <div className="container-centered">
          <div className="container">
            <div className="centered-text">
              <IconButton onClick={handleOpen}>
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
                    const state = states[element];
                    const prefix = state?.prefix?.toLowerCase() || '';
              
                  return (
                    <Link to={`${state.state_name}`}>
                      <div id={state.prefix} className="album">
                        <div className="side spine">
                          <span className="spine-title">
                            {state.state_name}
                          </span>
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
      )}

       <InfoAlbum
          open={openInfo}
          onClose={handleClose}
        />
    </>
  );
}

export default withProtected(Home);