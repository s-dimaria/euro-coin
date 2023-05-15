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

  const uuid = getUserInfo().id;
  const [album, setAlbum] = useState([]);
  const [startedYearofStates, setStartedYearOfStates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalEuro, setTotalEuro] = useState(0);
  const [totalComm, setTotalComm] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    async function fetchAlbum() {
      const yearOfState = await getStateWithCoins(state);
      const aEuro = await getAlbumCoinByState(uuid, state);
      const cEuro = await getAlbumCommemorativeByState(uuid, state);
      if (!ignore) {
        console.info("Done");
        setStartedYearOfStates(yearOfState);
        if (id === "euro") {
          setAlbum(aEuro);
          setTotalEuro(totalCoin(yearOfState[0].coin, Object.keys(values)));
        } else if (yearOfState[0].coin_commemorative !== null) {
          setAlbum(cEuro);
          setTotalComm(
            totalCoin(yearOfState[0].coin_commemorative, valuesComm)
          );
        }

        setLoading(false);
      }
    }
    fetchAlbum();

    return () => {
      ignore = true;
    };
  }, []);

  const totalCoin = (year, coinNum) => {
    let total = 0;
    let years = Object.keys(year);
    getYears(years[0], years[years.length - 1]).forEach((y) => {
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
    const thisYear =
      lastYear !== initYear ? lastYear : new Date().getFullYear();
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
          uuid={uuid}
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
