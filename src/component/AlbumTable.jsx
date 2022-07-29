import React, { useEffect, useState } from 'react';
import { deleteCoin } from '../service/supabase';
import '../style/AlbumTable.css'
import AlertDialog from './AlertDialog';
import CustomizedSnackbars from './CustomizedSnackbar';

function AlbumTable({ id, album, uuid, onDelete }) {

    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");

    const [coin, setCoin] = useState(null);


    const onConfirm = async () => {
        await deleteCoin(
            coin.state,
            coin.year,
            coin.value ? coin.value : "2 Euro",
            uuid).then(() => {
                onDelete(coin)
            }).then(() => {
                setCoin(null)
                setOpen(true)
                id === "euro" ?
                    setText("Moneta '" + coin.state + " " + coin.year + " " + coin.value + "' eliminata") :
                    setText("Moneta '" + coin.state + " " + coin.year + " " + coin.description + "' eliminata")
            })
    }

    const handleClose = () => {
        setCoin(null);
        setOpen(false);
    };

    return (
        <>
            {id === "euro" ?
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <tr>
                                <th style={{ width: "50vw" }}>Stato</th>
                                <th style={{ width: "30vw" }}>Anno</th>
                                <th style={{ width: "100vw" }}>Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (

                                            <tr onClick={() => {
                                                setTitle("Eliminare la moneta '" + album[key].state + " " + album[key].year + " " + album[key].value + "' ?")
                                                setCoin(album[key])
                                            }}>
                                                <td style={{ width: "50vw" }}>{album[key].state}</td>
                                                <td style={{ width: "30vw" }}>{album[key].year}</td>
                                                <td style={{ width: "100vw" }}>{album[key].value}</td>
                                            </tr>

                                        )
                                    })

                            }

                        </tbody>
                    </table>
                </div> :
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <tr>
                                <th style={{ width: "50vw" }}>Stato</th>
                                <th style={{ width: "30vw" }}>Anno</th>
                                <th style={{ width: "100vw" }}>Descrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (
                                            <tr onClick={() => {
                                                setTitle("Eliminare la moneta '" + album[key].state + " " + album[key].year + " " + album[key].description + "' ?");
                                                setCoin(album[key])
                                            }}>
                                                <td style={{ width: "50vw" }}>{album[key].state}</td>
                                                <td style={{ width: "30vw" }}>{album[key].year}</td>
                                                <td style={{ width: "100vw" }}>{album[key].description}</td>
                                            </tr>
                                        )
                                    })

                            }
                        </tbody>
                    </table>
                </div>
            }
            <AlertDialog onClose={handleClose} onConfirm={onConfirm} open={coin} title={title} text="Attenzione stai per eliminare una moneta. La conferma comporterà la modifica del tuo album." />
            <CustomizedSnackbars open={open} onClose={handleClose} text={text} severity="info" />
        </>
    )
}

export default AlbumTable;