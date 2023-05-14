import React, { useState } from "react";
import { putInsertCoinCommemorative } from "../service/supabase";
import "../style/AlbumTable.css";
import AlertDialog from "../info/AlertDialog";
import CustomizedSnackbars from "../info/CustomizedSnackbar";
import Popup from "../info/Popup";

function CoinTable({ coins, uuid, state }) {
  const [coin, setCoin] = useState(null);
  const [img, setImg] = useState("");
  const [infoImg, setInfoImg] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");

  const handleClose = () => {
    setCoin(null);
    setOpen(false);
  };

  const setParametersOfCoin = (dataItem) => {
    setCoin(dataItem);
    setImg(dataItem.imageUrl);
    setInfoImg(dataItem.description);
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th style={{ width: "100vw", fontSize: "1.2em" }}>
                Commemorative
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(coins)
              .sort((a, b) => (coins[a].order > coins[b].ordder ? -1 : 1))
              .map((key) => {
                {
                  return Object.values(coins[key]).map((dataItem) => {
                    if (dataItem.title !== "") {
                      return (
                        <tr
                          onClick={() => {
                            setTitle(
                              "Moneta commemorativa '" +
                                state +
                                " " +
                                dataItem.year +
                                " " +
                                dataItem.title +
                                "'"
                            );
                            setParametersOfCoin(dataItem);
                          }}
                        >
                          <td style={{ width: "30vw" }}>{key}</td>
                          <td style={{ width: "30vw" }}>
                            <img src={dataItem.imageUrl} />
                          </td>
                          <td style={{ width: "50vw" }}>{dataItem.title}</td>
                        </tr>
                      );
                    }
                  });
                }
              })}
          </tbody>
        </table>
      </div>
      <Popup
        onClose={handleClose}
        open={coin}
        image={img}
        infoImg={infoImg}
        title={title}
      />
    </>
  );
}

export default CoinTable;
