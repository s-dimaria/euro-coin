import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCoinAndCoinCommWithDetail, getUserInfo } from '../service/supabase';
import Popup from '../info/Popup';
import LoadingSpinner from '../info/LoadingSpinner';
import CoinTable from './CoinTable';

import '../style/Coins.css';

function Info({ details }) {

  return (
    <div style={{ textAlign: "justify" }}>
      <p>{details}</p>
    </div>
  );

}

function CoinStates() {

  const [coin, setCoin] = useState([]);
  const [coinComm, setCoinComm] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [titlePopCoin, setTitlePopCoin] = useState("");
  const [storyCoin, setStoryCoin] = useState("");
  const [loading, setLoading] = useState(false);
  const uuid = getUserInfo().id;

  const { id } = useParams();

  useEffect(() => {

    let ignore = false;
    setLoading(true)
    async function startFetching() {
      const coins = await getCoinAndCoinCommWithDetail(id);
      if (!ignore) {
        console.info("Done");
        setCoin(coins.coin);
        setStoryCoin(coins.detail);
        setCoinComm(coins.coin_commemorative);
        setLoading(false)
      }
    }
    startFetching();

    return () => { ignore = true };

  }, [id])


  const setParametersPopup = (imageUrl, value) => {

    setSelectedImage(imageUrl)
    setTitlePopCoin(value)

  }

  function closePopup() {
    setSelectedImage(null)
  }

  return (
    <>
      {loading ? <LoadingSpinner /> : <>
        <Info details={storyCoin}></Info>
        {Object.keys(coin).map((key) => {
          return (
            <>
              <h2>In vigore dal: {key}</h2>
              <hr />
              <div className="columnBox">
                {Object.values(coin[key])
                  .sort((a, b) => a.order > b.order ? 1 : -1)
                  .map((dataItem) => {
                    return (
                      <div className="imageBox">
                        <img
                          onClick={() => {
                            setParametersPopup(dataItem.imageUrl, dataItem.value)
                          }}
                          className="imageCoin" src={dataItem.imageUrl}>
                        </img>
                      </div>
                    )
                  })}
              </div>
            </>
          )
        })}
        {coinComm ?
        <CoinTable coins={coinComm} uuid={uuid} state={id} /> : <></>}
        <Popup open={selectedImage} onClose={closePopup} title={titlePopCoin}>
          <div className="pop-container">
            <div className="pop-image">
              <img className="imagePop" src={selectedImage} modal nested></img>
            </div>
          </div>
        </Popup></>
      }
    </>
  );
}

export default CoinStates;