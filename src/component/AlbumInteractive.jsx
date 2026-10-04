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

  const germanyLetters = [
    "A",
    "D",
    "F",
    "G",
    "J",
  ];

  const handleClose = () => {
    setOpen(false);
    setCoin(null);
    setDeletedCoin(null);
  };

  const getCoinReferenceText = (coinData) => {
    if (!coinData) return "";

    const year = coinData.year ?? "";
    const state = coinData.state ?? "";
    const letter = coinData.letter ? ` ${coinData.letter}` : "";
    const description = coinData.description
      ? ` ${coinData.description}`
      : coinData.value
        ? ` ${coinData.value}`
        : "";

    return `${state} ${year}${letter}${description}`;
  };

  const onConfirmDelete = async () => {
    id === "euro"
      ? await deleteCoin(
          deletedCoin.state,
          deletedCoin.year,
          deletedCoin.value,
          deletedCoin.letter,
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
                (deletedCoin.letter ? " " + deletedCoin.letter : "") +
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
          deletedCoin.letter,
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
                getCoinReferenceText(deletedCoin) +
                "' eliminata"
            );
            setSeverity("info");
          });
  };

  const onConfirm = async () => {
    console.debug(coin);
    id === "euro"
      ? await putInsertCoin(
          coin.state,
          coin.year,
          coin.value,
          coin.letter,
          uuid
        )
          .then((response) => {
            const insertedCoin = response?.data?.[0] ?? {
              state: coin.state,
              year: coin.year,
              value: coin.value,
              ...(coin.letter ? { letter: coin.letter } : {}),
            };

            onInsert(insertedCoin);
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
                (coin.letter ? " - " + coin.letter : "") +
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
          coin.letter,
          uuid
        )
          .then((data) => {
            const insertedCoin = data ?? {
              state: coin.state,
              year: coin.year,
              description: coin.description,
              ...(coin.letter ? { letter: coin.letter } : {}),
            };

            console.debug(insertedCoin);
            onInsert(insertedCoin);
          })
          .then(() => {
            setCoin(null);
            setDeletedCoin(null);
            setOpen(true);
            setText(
              "Moneta '" +
                getCoinReferenceText(coin) +
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

  const getGermanyCoin = (coinSet, yearKey, letter) => {
    const yearCoins = coinSet?.[yearKey];

    if (yearCoins?.[letter]) {
      return yearCoins[letter];
    }

    if (coinSet?.[letter]) {
      return coinSet[letter];
    }

    return yearCoins;
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
          let isGermany = state === "Germania";
          let years;

          // Euro Table
          if (id === "euro") {
            years = Object.keys(startedYearofStates[key].coin);
            if (isGermany) {
              return years.length !== 0 ? (
                <>
                  <p>
                    {album.length}/{totalEuro}
                  </p>
                  <hr />
                  <div className="containerGrid">
                    {getYears(years[0]).map(
                      (yearValue) => {
                        const coinYearKey = imageSelect(yearValue, years);

                        return (
                          <div
                            className="rowAlbum"
                            key={yearValue}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.75rem",
                              paddingTop: "1rem",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                textAlign: "center",
                                fontWeight: 700,
                              }}
                            >
                              <span>{yearValue}</span>
                            </div>
                            <section
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                              }}
                            >
                              {germanyLetters.map((letter) => {
                                const coinByLetter = getGermanyCoin(
                                  startedYearofStates[key].coin,
                                  coinYearKey,
                                  letter
                                );

                                if (!coinByLetter) {
                                  return null;
                                }

                                return (
                                  <section
                                    key={`${yearValue}-${letter}`}
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                    }}
                                  >
                                    <div className="firstColumn">
                                      <span>{letter}</span>
                                    </div>
                                    <div>
                                      {Object.keys(values).map((value) => {
                                        let coin = album.find(
                                          (data) =>
                                            data.state === state &&
                                            data.year === yearValue &&
                                            data.value === values[value] &&
                                            (data.letter ?? null) === (letter ?? null)
                                        );
                                        const imageUrl =
                                          coinByLetter?.[value]?.imageUrl;
                                        const coinTitle =
                                          state +
                                          " " +
                                          yearValue +
                                          " " +
                                          letter +
                                          " " +
                                          values[value];

                                        return coin ? (
                                          <button
                                            key={`${yearValue}-${letter}-${value}`}
                                            className="disabled"
                                            onClick={() => {
                                              setTitle(
                                                "Eliminare la moneta '" +
                                                  coinTitle +
                                                  "' ?"
                                              );
                                              setDeletedCoin(
                                                coin ?? {
                                                  state,
                                                  year: yearValue,
                                                  value: values[value],
                                                  letter,
                                                }
                                              );
                                              setImg(imageUrl);
                                            }}
                                          >
                                            <img alt="" src={imageUrl}></img>
                                          </button>
                                        ) : (
                                          <button
                                            key={`${yearValue}-${letter}-${value}`}
                                            onClick={() => {
                                              setTitle(
                                                "Inserire la moneta '" +
                                                  coinTitle +
                                                  "' ?"
                                              );
                                              setCoin({
                                                state: state,
                                                year: yearValue,
                                                value: values[value],
                                                letter: letter,
                                              });
                                              setImg(imageUrl);
                                            }}
                                          ></button>
                                        );
                                      })}
                                    </div>
                                  </section>
                                );
                              })}
                            </section>
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

            if (isGermany) {
              return years.length !== 0 ? (
                <>
                  <p>
                    {album.length}/{totalComm}
                  </p>
                  <hr />
                  <div className="containerGrid">
                    {getYears(years[0], years[years.length - 1]).map(
                      (yearValue) => {
                        const coinYearKey = imageSelect(yearValue, years);

                        return (
                          <div
                            key={yearValue}
                            className="rowAlbum"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.75rem",
                              paddingTop: "1rem",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                textAlign: "center",
                                fontWeight: 700,
                              }}
                            >
                              <span>{yearValue}</span>
                            </div>
                            <section
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                              }}
                            >
                              {germanyLetters.map((letter) => {
                                const coinByLetter = getGermanyCoin(
                                  startedYearofStates[key].coin_commemorative,
                                  coinYearKey,
                                  letter
                                );

                                if (!coinByLetter) {
                                  return null;
                                }

                                return (
                                  <section
                                    key={`${yearValue}-${letter}`}
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                    }}
                                  >
                                    <div className="firstColumn">
                                      <span>{letter}</span>
                                    </div>
                                    <div>
                                      {valuesComm.map((value) => {
                                        const commCoin = coinByLetter?.[value];

                                        if (!commCoin) {
                                          return (
                                            <button
                                              key={`${yearValue}-${letter}-${value}`}
                                              disabled
                                            ></button>
                                          );
                                        }

                                        const coinTitle = commCoin.title;
                                        const imageUrl = commCoin.imageUrl;
                                        const coinLabel = `${state} ${yearValue}${letter ? ` ${letter}` : ""} ${coinTitle}`;

                                        let coin = album.find(
                                          (data) =>
                                            data.state === state &&
                                            data.year === yearValue &&
                                            data.description === coinTitle &&
                                            (data.letter ?? null) === (letter ?? null)
                                        );

                                        return coin ? (
                                          <button
                                            key={`${yearValue}-${letter}-${value}`}
                                            className="disabled"
                                            onClick={() => {
                                              setTitle(
                                                "Eliminare la moneta '" +
                                                  coinLabel +
                                                  "' ?"
                                              );
                                              setDeletedCoin(coin);
                                              setImg(imageUrl);
                                            }}
                                          >
                                            <img
                                              alt=""
                                              className="imgComm"
                                              src={imageUrl}
                                            ></img>
                                          </button>
                                        ) : (
                                          <button
                                            key={`${yearValue}-${letter}-${value}`}
                                            onClick={() => {
                                              setImg(imageUrl);
                                              setTitle(
                                                `Inserire la moneta '${state} ${yearValue}${letter ? ` ${letter}` : ""} ${coinTitle}' ?`
                                              );
                                              setCoin({
                                                state: state,
                                                year: yearValue,
                                                ...(letter ? { letter } : {}),
                                                description: coinTitle,
                                              });
                                            }}
                                          ></button>
                                        );
                                      })}
                                    </div>
                                  </section>
                                );
                              })}
                            </section>
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
                        <div className="rowAlbum" key={yearValue}>
                          <>
                            <div className="firstColumn">
                              <span>{yearValue}</span>
                            </div>
                            <div>
                              {valuesComm.map((value) => {
                                if (
                                  startedYearofStates[key].coin_commemorative[
                                    yearValue
                                  ] === undefined ||
                                  startedYearofStates[key].coin_commemorative[
                                    yearValue
                                  ][value] === undefined
                                ) {
                                  return <button key={`${yearValue}-${value}`} disabled></button>;
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

                                const coinTitle =
                                  startedYearofStates[key].coin_commemorative[
                                    yearValue
                                  ][value].title;
                                const imageUrl =
                                  startedYearofStates[key].coin_commemorative[
                                    yearValue
                                  ][value].imageUrl;
                                const coinLabel = `${state} ${yearValue} ${coinTitle}`;

                                return coin ? (
                                  <button
                                    key={`${yearValue}-${value}`}
                                    className="disabled"
                                    onClick={() => {
                                      setTitle(
                                        "Eliminare la moneta '" +
                                          coinLabel +
                                          "' ?"
                                      );
                                      setDeletedCoin(coin);
                                      setImg(imageUrl);
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
                                    key={`${yearValue}-${value}`}
                                    onClick={() => {
                                      setImg(imageUrl);
                                      setTitle(
                                        `Inserire la moneta '${coinLabel}' ?`
                                      );
                                      setCoin({
                                        state: state,
                                        year: yearValue,
                                        description: coinTitle,
                                      });
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
