import { useState } from "react";
import { values, valuesComm } from "../utils/constants";
import {
  putInsertCoin,
  putInsertCoinCommemorative,
  deleteCoin,
  deleteCommemorative,
} from "../service/supabase";
import CustomizedSnackbars from "../info/CustomizedSnackbar";
import AlertDialog from "../info/AlertDialog";
import "../style/AlbumTable.css";
import "../style/App.css";

function AlbumInteractive({
  id,
  uuid,
  album,
  startedYearofStates,
  onInsert,
  onDelete,
  totalEuro,
  totalComm
}) {
  const [coin, setCoin] = useState(null);
  const [deletedCoin, setDeletedCoin] = useState(null);

  const [open, setOpen] = useState(false);
  const [img, setImg] = useState("");

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("info");

  const handleClose = () => {
    setOpen(false);
    setCoin(null);
    setDeletedCoin(null);
  };

  const onConfirmDelete = async () => {
    id === "euro"
      ? await deleteCoin(
          deletedCoin.state,
          deletedCoin.year,
          deletedCoin.value,
          uuid
        )
          .then(() => onDelete(deletedCoin))
          .then(() => {
            setDeletedCoin(null);
            setCoin(null);
            setOpen(true);
            setText(
              "Moneta '" +
                deletedCoin.state +
                " " +
                deletedCoin.year +
                " " +
                deletedCoin.value +
                "' eliminata"
            );
            setSeverity("info");
          })
      : await deleteCommemorative(
          deletedCoin.state,
          deletedCoin.year,
          deletedCoin.description,
          uuid
        )
          .then(() => {
            onDelete(deletedCoin);
          })
          .then(() => {
            setDeletedCoin(null);
            setCoin(null);
            setOpen(true);
            setText(
              "Moneta '" +
                deletedCoin.state +
                " " +
                deletedCoin.year +
                " " +
                deletedCoin.description +
                "' eliminata"
            );
            setSeverity("info");
          });
  };

  const onConfirm = async () => {
    id === "euro"
      ? await putInsertCoin(coin.state, coin.year, coin.value, uuid)
          .then((data) => onInsert(data.data[0]))
          .then(() => {
            setCoin(null);
            setDeletedCoin(null);
            setOpen(true);
            setText(
              "Moneta '" +
                coin.state +
                " - " +
                coin.year +
                " - " +
                coin.value +
                "' inserita nell'album"
            );
            setSeverity("success");
       })
      : await putInsertCoinCommemorative(
          coin.state,
          coin.year,
          coin.description,
          uuid
        )
          .then((data) => {
            console.log(data);
            onInsert(data);
          })
          .then(() => {
            setCoin(null);
            setDeletedCoin(null);
            setOpen(true);
            setText(
              "Moneta '" +
                coin.state +
                " - " +
                coin.year +
                " - " +
                coin.description +
                "' inserita nell'album"
            );
            setSeverity("success");
          });
  };

  const getYears = (initYear, lastYear) => {
    const thisYear =
      lastYear || new Date().getFullYear();
    const retval = [];
    for (let i = parseInt(initYear); i <= thisYear; i++) retval.push(i);
    return retval;
  };

  const imageSelect = (yearValue, years) => {
    for (let i = 0; i <= years.length; i++) {
      if (yearValue >= years[years.length - 1]) {
        return years[years.length - 1];
      }
      if (yearValue >= years[i] && yearValue < years[i + 1]) {
        return years[i];
      }
    }
  };

  return (
    <>
      {Object.keys(startedYearofStates)
        .sort((a, b) =>
          startedYearofStates[a].state_name > startedYearofStates[b].state_name
            ? 1
            : -1
        )
        .map((key) => {
          let state = startedYearofStates[key].state_name;
          let years;

          // Euro Table
          if (id === "euro") {
            years = Object.keys(startedYearofStates[key].coin);
            if (years.length === 1) {
              return (
                <>
                  <p>
                    {album.length}/{totalEuro}
                  </p>
                  <hr />
                  <div className="containerGrid">
                    {getYears(years[0]).map(
                      (yearValue) => {
                        return (
                          <div className="rowAlbum">
                            <>
                              <div className="firstColumn">
                                <span>{yearValue}</span>
                              </div>
                              <div>
                                {Object.keys(values).map((value) => {
                                  let coin = album.find(
                                    (data) =>
                                      data.state === state &&
                                      data.year === yearValue &&
                                      data.value === values[value]
                                  );
                                  return coin ? (
                                    <button className="disabled"
                                      onClick={() => {
                                          setTitle(
                                            "Eliminare la moneta '" +
                                              state +
                                              " " +
                                              yearValue +
                                              " " +
                                              values[value] +
                                              "' ?"
                                          );
                                          setDeletedCoin(coin);
                                          setImg(
                                            startedYearofStates[key].coin[
                                              years[0]
                                            ][value].imageUrl
                                          );
                                      }}>
                                      <img
                                        alt=""
                                        src={
                                          startedYearofStates[key].coin[
                                            years[0]
                                          ][value].imageUrl
                                        }
                                      ></img>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setTitle(
                                          "Inserire la moneta '" +
                                            state +
                                            " " +
                                            yearValue +
                                            " " +
                                            values[value] +
                                            "' ?"
                                        );
                                        setCoin({
                                          state: state,
                                          year: yearValue,
                                          value: values[value],
                                        });
                                        setImg(
                                          startedYearofStates[key].coin[
                                            years[0]
                                          ][value].imageUrl
                                        );
                                      }}
                                    ></button>
                                  );
                                })}
                              </div>
                            </>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <p>
                    {album.length}/{totalEuro}
                  </p>
                  <hr />
                  <div className="containerGrid">
                    {getYears(years[0]).map(
                      (yearValue) => {
                        console.log(yearValue)
                        return (
                          <div className="rowAlbum">
                            <>
                              <div className="firstColumn">
                                <span>{yearValue}</span>
                              </div>
                              <div>
                                {Object.keys(values).map((value) => {
                                  let coin = album.find(
                                    (data) =>
                                      data.state === state &&
                                      data.year === yearValue &&
                                      data.value === values[value]
                                  );
                                  // findCoin(state, yearValue, values[value]) ?
                                  return coin ? (
                                    <button className="disabled"
                                      onClick={() => {
                                          setTitle(
                                            "Eliminare la moneta '" +
                                              state +
                                              " " +
                                              yearValue +
                                              " " +
                                              values[value] +
                                              "' ?"
                                          );
                                          setDeletedCoin(coin);
                                          setImg(
                                            startedYearofStates[key].coin[
                                              imageSelect(yearValue, years)
                                            ][value].imageUrl
                                          );
                                        }}
                                    >
                                      <img
                                        alt=""
                                        src={
                                          startedYearofStates[key].coin[
                                            imageSelect(yearValue, years)
                                          ][value].imageUrl
                                        }
                                      ></img>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setTitle(
                                          "Inserire la moneta '" +
                                            state +
                                            " " +
                                            yearValue +
                                            " " +
                                            values[value] +
                                            "' ?"
                                        );
                                        setCoin({
                                          state: state,
                                          year: yearValue,
                                          value: values[value],
                                        });
                                        setImg(
                                          startedYearofStates[key].coin[
                                            imageSelect(yearValue, years)
                                          ][value].imageUrl
                                        );
                                      }}
                                    ></button>
                                  );
                                })}
                              </div>
                            </>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              );
            }
          }
          // Commemorative Table
          else {
            years = startedYearofStates[key].coin_commemorative
              ? Object.keys(startedYearofStates[key].coin_commemorative)
              : [];
            return years.length !== 0 ? (
              <>
                <p>
                  {album.length}/{totalComm}
                </p>
                <hr />
                <div className="containerGrid">
                  {getYears(years[0], years[years.length - 1]).map(
                    (yearValue) => {
                      return (
                        <div className="rowAlbum">
                          <>
                            <div className="firstColumn">
                              <span>{yearValue}</span>
                            </div>
                            <div>
                              {valuesComm.map((value) => {
                                if (startedYearofStates[key].coin_commemorative[
                                                                    yearValue
                                                                  ] === undefined ||
                                                                  startedYearofStates[key].coin_commemorative[
                                                                    yearValue
                                                                  ][value] === undefined) {
                                  return <button disabled></button>;
                                }

                                let coin = album.find(
                                  (data) =>
                                    data.state === state &&
                                    data.year === yearValue &&
                                    data.description ===
                                      startedYearofStates[key]
                                        .coin_commemorative[yearValue][value]
                                        .title
                                );

                                return coin ? (
                                  <button className="disabled"
                                    onClick={() => {
                                        setTitle(
                                          "Eliminare la moneta '" +
                                            state +
                                            " " +
                                            yearValue +
                                            " " +
                                            startedYearofStates[key]
                                              .coin_commemorative[yearValue][
                                              value
                                            ].title +
                                            "' ?"
                                        );
                                        setDeletedCoin(coin);
                                        setImg(
                                          startedYearofStates[key]
                                            .coin_commemorative[yearValue][
                                            value
                                          ].imageUrl
                                        );
                                      }}
                                    >
                                    <img
                                      alt=""
                                      className="imgComm"
                                      src={
                                        startedYearofStates[key]
                                          .coin_commemorative[yearValue][value]
                                          .imageUrl
                                      }
                                    ></img>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setImg(
                                        startedYearofStates[key]
                                          .coin_commemorative[yearValue][value]
                                          .imageUrl
                                      );
                                      setTitle(
                                        `Inserire una moneta commemorativa dello stato ${state}?`
                                      );
                                      setCoin({
                                        state: state,
                                        year: yearValue,
                                        description:
                                          startedYearofStates[key]
                                            .coin_commemorative[yearValue][
                                            value
                                          ].title,
                                      });
                                      //setStateToNavigate(state)
                                    }}
                                  ></button>
                                );
                              })}
                            </div>
                          </>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            ) : (
              <></>
            );
          }
        })}
      <AlertDialog
        onClose={handleClose}
        onConfirm={onConfirm}
        open={coin}
        title={title}
        image={img}
        text="Attenzione stai per inserire una moneta. La conferma comporterà la modifica del tuo album."
      />
      <AlertDialog
        onClose={handleClose}
        onConfirm={onConfirmDelete}
        open={deletedCoin}
        title={title}
        image={img}
        text="Attenzione stai per eliminare una moneta. La conferma comporterà la modifica del tuo album."
      />
      <CustomizedSnackbars
        open={open}
        onClose={handleClose}
        text={text}
        severity={severity}
      />
    </>
  );
}

export default AlbumInteractive;
