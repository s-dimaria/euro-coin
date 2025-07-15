import AlbumInteractive from "../component/AlbumInteractive";
import LoadingSpinner from "../info/LoadingSpinner";
import React, { useState, useEffect } from "react";

import {
  getUserInfo,
  getAlbumCoinByState,
  getAlbumCommemorativeByState,
  getStateWithCoins,
} from "../service/supabase";
import { values, valuesComm } from "../utils/constants";

function AlbumCase({ id, state }) {
  const [userInfo, setUserInfo] = useState(null);
  const [album, setAlbum] = useState([]);
  const [startedYearofStates, setStartedYearOfStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalEuro, setTotalEuro] = useState(0);
  const [totalComm, setTotalComm] = useState(0);

  // Carica le informazioni dell'utente all'avvio
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        setUserInfo(user);
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setInitialLoad(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Carica i dati dell'album quando le info utente sono disponibili
  useEffect(() => {
    if (!userInfo || initialLoad) return;

    let ignore = false;
    setLoading(true);

    async function fetchAlbum() {
      try {
        const yearOfState = await getStateWithCoins(state);
        const aEuro = await getAlbumCoinByState(userInfo.id, state);
        const cEuro = await getAlbumCommemorativeByState(userInfo.id, state);

        if (!ignore) {
          console.debug("Done");
          setStartedYearOfStates(yearOfState);
          
          if (id === "euro") {
            setAlbum(aEuro);
            setTotalEuro(totalCoin(yearOfState[0].coin, Object.keys(values)));
          } else if (yearOfState[0].coin_commemorative !== null) {
            setAlbum(cEuro);
            setTotalComm(totalCoin(yearOfState[0].coin_commemorative, valuesComm));
          }
        }
      } catch (error) {
        console.error("Error fetching album data:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchAlbum();

    return () => {
      ignore = true;
    };
  }, [userInfo, state, id, initialLoad]);

  const totalCoin = (year, coinNum) => {
    let total = 0;
    let years = Object.keys(year);
    getYears(years[0]).forEach((y) => {
      coinNum.forEach((c) => {
        if (id === "euro") {
          total++;
        } else if (!(year[y] === undefined || year[y][c] === undefined)) {
          total++;
        }
      });
    });
    return total;
  };

  const getYears = (initYear, lastYear) => {
    const thisYear = lastYear || new Date().getFullYear();
    const retval = [];
    for (let i = parseInt(initYear); i <= thisYear; i++) retval.push(i);
    return retval;
  };

  const onInsert = (newInsert) => {
    setAlbum([...album, newInsert]);
  };

  const onDelete = (deletedCoin) => {
    setAlbum(album.filter((coin) => coin !== deletedCoin));
  };

  if (initialLoad) {
    return <LoadingSpinner />;
  }

  if (!userInfo) {
    return <div>Errore nel caricamento delle informazioni utente</div>;
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <AlbumInteractive
          state={state}
          id={id}
          album={album}
          startedYearofStates={startedYearofStates}
          uuid={userInfo.id}
          onInsert={onInsert}
          onDelete={onDelete}
          totalEuro={totalEuro}
          totalComm={totalComm}
        />
      )}
    </>
  );
}

export default AlbumCase;