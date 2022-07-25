import React, { useState, useEffect } from 'react';
import '../style/AlbumTable.css'

function AlbumTable({ id, album }) {

    return (
        <>
            {id == "euro" ?
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <tr>
                                <th>Stato</th>
                                <th>Anno</th>
                                <th>Valore</th>
                                {/* <th>Commemorativa</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (

                                            <tr>
                                                <td>{album[key].state}</td>
                                                <td>{album[key].year}</td>
                                                <td>{album[key].value}</td>
                                                {/* {album[key].commemorative ? 
                            <td>si</td> :
                            <td>no</td>
                            } */}
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
                                <th>Stato</th>
                                <th>Anno</th>
                                <th>Descrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(album)
                                    .sort((a, b) => album[a].state > album[b].state ? 1 : -1)
                                    .map((key) => {
                                        return (
                                            <tr>
                                                <td>{album[key].state}</td>
                                                <td>{album[key].year}</td>
                                                <td>{album[key].description}</td>
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