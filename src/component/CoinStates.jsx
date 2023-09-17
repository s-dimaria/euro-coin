import React, { useEffect, useState } from "react";
import { ReactComponent as Arrow } from "../Arrow_right.svg";
import { ReactComponent as Home } from "../home-icon.svg";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { getCoinAndCoinCommWithDetail, getUserInfo } from "../service/supabase";
import Popup from "../info/Popup";
import CoinTable from "./CoinTable";
import AlbumCase from "../routes/albumCase";

import "../style/Coins.css";
import LoadingAlbum from "../info/LoadingAlbum";

function Info({ details, state, changePage }) {

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "justify" }}>
      <div className="headerNav">
        <h3>{state}</h3>
        <div>
          <Home class="homeIcon" onClick={() => navigate("/albums",{replace:"true"})} />
          <Arrow onClick={changePage} />
        </div>
      </div>
      <p>{details}</p>
    </div>
  );
}

function CoinStates() {
  const uuid = getUserInfo().id;

  const [coin, setCoin] = useState([]);
  const [coinComm, setCoinComm] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [titlePopCoin, setTitlePopCoin] = useState("");
  const [storyCoin, setStoryCoin] = useState("");

  const [loading, setLoading] = useState(false);

  const [isZoomed, setIsZoomed] = useState(false);
  const [newPage, setNewPage] = useState(false);
  const [back, setBack] = useState(false);
  const [zIndex, setZIndex] = useState(2);

  const { id } = useParams();

  const handleAnimationEnd = () => {
    setIsZoomed(true);
  };

  const handleAnimation = (event) => {
    if (event.animationName === "reverseRotatePage") {
      setBack(false);
    }
  };

  const changePage = () => {
    setNewPage(true);
    setZIndex(zIndex + 1);
  };

  const backPage = () => {
    setNewPage(false);
    setBack(true);
    setZIndex(zIndex > 3 ? zIndex - 1 : zIndex);
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    async function startFetching() {
      const coins = await getCoinAndCoinCommWithDetail(id);
      if (!ignore) {
        console.info("Done");
        setCoin(coins.coin);
        setStoryCoin(coins.detail);
        setCoinComm(coins.coin_commemorative);
        setTimeout(() => {
          setLoading(false);
        }, 700);
      }
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, [id]);

  const setParametersPopup = (imageUrl, value) => {
    setSelectedImage(imageUrl);
    setTitlePopCoin(value);
  };

  function closePopup() {
    setSelectedImage(null);
  }

  return (
    <>
      {loading ? (
        <LoadingAlbum />
      ) : (
        <>
          <div className="main">
            <div className="book" onAnimationEnd={handleAnimationEnd}>
              <div class={`book-cover ${isZoomed ? "changePage" : ""}`}>
                <div className={`${isZoomed ? "fadingOut" : ""}`}>
                  <h1>{id}</h1>
                </div>
              </div>
              <div
                className={`book-content page ${newPage ? "changePage" : ""} ${back ? "backPage" : ""
                  }`}
                style={{ zIndex: zIndex }}
                onAnimationEndCapture={handleAnimation}
              >
                <div className={`${newPage ? "fadingOut" : "fadingIn"} `}>
                  <Info
                    details={storyCoin}
                    state={id}
                    changePage={() => changePage()}

                  ></Info>
                  {Object.keys(coin).map((key) => {
                    return (
                      <>
                        <h2>In vigore dal: {key}</h2>
                        <hr style={{ width: "90%" }} />
                        <div className="columnBox">
                          {Object.values(coin[key])
                            .sort((a, b) => (a.order > b.order ? 1 : -1))
                            .map((dataItem) => {
                              return (
                                <div className="imageBox">
                                  <img
                                    onClick={() => {
                                      setParametersPopup(
                                        dataItem.imageUrl,
                                        dataItem.value
                                      );
                                    }}
                                    className="imageCoin"
                                    src={dataItem.imageUrl}
                                    alt=""
                                  ></img>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    );
                  })}
                  {coinComm ? (
                    <CoinTable coins={coinComm} uuid={uuid} state={id} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="book-content" style={{ zIndex: zIndex }}>
                <div className="headerNav">
                  <h3>Euro Comuni</h3>
                  <Arrow className="leftArrow" onClick={backPage} />
                </div>
                <AlbumCase id="euro" state={id} />
                {coinComm ? <h3>Euro Commemorativi</h3> : <></>}
                <AlbumCase id="commemorative" state={id} />
              </div>
            </div>
          </div>
          <Popup
            open={selectedImage} onClose={closePopup} title={titlePopCoin}
            image={selectedImage} />
        </>
      )}
    </>
  );
}

export default CoinStates;
