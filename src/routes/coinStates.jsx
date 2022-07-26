
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Popup from '../component/Popup';
import 'reactjs-popup/dist/index.css';

import '../style/Coins.css';

import { getCoinByStates, getInfoCoinByStates } from '../service/supabase';
import LoadingSpinner from '../component/LoadingSpinner';

function Info({details}) {

  return ( 
      <div style={{textAlign: "justify"}}>
          <p>{details}</p>
      </div>
  );

}

function CoinStates() {

    const [coin, setCoin] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [infoPopCoin, setInfoPopCoin] = useState("");
    const [storyCoin, setStoryCoin] = useState("");
    const [loading, setLoading] = useState(false);

    const {id} = useParams();

    useEffect(() => {

        let ignore = false;
        setLoading(true)
        async function startFetching() {
            const coins = await getCoinByStates(id);
            const story = await getInfoCoinByStates(id);
            if(!ignore) {
              console.info("Done");
              setCoin(coins);
              setStoryCoin(story);
              setLoading(false)

            }
          }
            startFetching();
      
            return () => {ignore=true} ;

    },[id])

    const setParametersPopup = (imageUrl, value) => {

        setSelectedImage(imageUrl)
        setInfoPopCoin(value)

    }

    function closePopup() {
        setSelectedImage(null)
    }


    return(
        <div>
        {loading ? <LoadingSpinner/> :<>
        <Info details={storyCoin}></Info>
        {Object.keys(coin).map((key) => {
           return (
             <div>
                <h2>In vigore dal: {key}</h2>
                <hr/>
                <div className="columnBox">
                {Object.values(coin[key])
                .sort((a,b) => a.order > b.order ? 1 : -1)
                .map((dataItem) => {
                  return (
                    <div className="imageBox">
                        <img 
                            onClick={()=>setParametersPopup(dataItem.imageUrl, dataItem.value)} 
                            className="imageCoin" src={dataItem.imageUrl}>
                        </img>
                    </div>
                  )
                 })}
                 </div>
             </div>
           )
         })}
         <Popup open={selectedImage} onClose={closePopup} infoPopup={infoPopCoin}>
            <br/>
            <img className="imagePop" src={selectedImage} modal nested></img>
         </Popup></>
         }
       </div>
    );
}

export default CoinStates;