import AlbumInteractive from "../component/AlbumInteractive";
import LoadingSpinner from "../info/LoadingSpinner";
import React, { useState, useEffect, useCallback } from "react";

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

  const totalCoin = useCallback(
    (year, coinNum) => {

      console.debug("Calculating total coins for year:", year, "and coinNum:", coinNum);
      let total = 0;
      let years = Object.keys(year);
      let isGermany = state === "Germania";
      let germanyLetters = ["A", "D", "F", "G", "J"];

      getYears(years[0]).forEach((y) => {
        console.log("Year: ", y, " CoinNum: ", coinNum);
        coinNum.forEach((c) => {
          if (id === "euro") {
            isGermany ? total += germanyLetters.length : total++;
          } else if (!(year[y] === undefined || year[y][c] === undefined)) {
            isGermany ? total += germanyLetters.length : total++;
          }
        });
      });
      return total;
    },
    [id]
  );

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
  }, [userInfo, state, id, initialLoad, totalCoin]);

  const getYears = (initYear, lastYear) => {
    const thisYear = lastYear || new Date().getFullYear();
    const retval = [];
    for (let i = parseInt(initYear); i <= thisYear; i++) retval.push(i);
    return retval;
  };

  const isSameCoin = (a, b) => {
    if (!a || !b) return false;

    return (
      a.state === b.state &&
      a.year === b.year &&
      a.value === b.value &&
      (a.description ?? null) === (b.description ?? null) &&
      (a.letter ?? null) === (b.letter ?? null)
    );
  };

  const onInsert = (newInsert) => {
    setAlbum((prevAlbum) => {
      if (prevAlbum.some((coin) => isSameCoin(coin, newInsert))) {
        return prevAlbum;
      }

      return [...prevAlbum, newInsert];
    });
  };

  const onDelete = (deletedCoin) => {
    setAlbum((prevAlbum) =>
      prevAlbum.filter((coin) => !isSameCoin(coin, deletedCoin))
    );
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