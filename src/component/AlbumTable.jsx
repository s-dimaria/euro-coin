import React from 'react';
import {deleteCoin} from '../service/supabase';
import '../style/AlbumTable.css'

function AlbumTable({ id, album, uuid, onDelete}) {

    const onDeleteCoin = async(coinToDelete) => {
        await deleteCoin(
            coinToDelete.state,
            coinToDelete.year,
            coinToDelete.value ?  coinToDelete.value : "2 Euro",
            uuid).then(()=> onDelete(coinToDelete))
    }

    return (
        <>
            {id == "euro" ?
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <tr>
                                <th style={{width: "50vw"}}>Stato</th>
                                <th style={{width: "30vw"}}>Anno</th>
                                <th style={{width: "100vw"}}>Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (

                                            <tr onClick={() => onDeleteCoin(album[key])}>
                                                <td style={{width: "50vw"}}>{album[key].state}</td>
                                                <td style={{width: "30vw"}}>{album[key].year}</td>
                                                <td style={{width: "100vw"}}>{album[key].value}</td>
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
                                <th style={{width: "50vw"}}>Stato</th>
                                <th style={{width: "30vw"}}>Anno</th>
                                <th style={{width: "100vw"}}>Descrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (
                                            <tr onClick={() => onDeleteCoin(album[key])}>
                                                <td style={{width: "50vw"}}>{album[key].state}</td>
                                                <td style={{width: "30vw"}}>{album[key].year}</td>
                                                <td style={{width: "100vw"}}>{album[key].description}</td>
                                            </tr>
                                        )
                                    })

                            }
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}

export default AlbumTable;