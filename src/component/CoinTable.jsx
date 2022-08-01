import React, { useState } from 'react';
import { deleteCoin, deleteCommemorative } from '../service/supabase';
import '../style/AlbumTable.css'
import AlertDialog from './AlertDialog';
import CustomizedSnackbars from './CustomizedSnackbar';

function CoinTable({ coin , onClick}) {

    return (
        <>
            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                        <tr>
                            <th style={{ width: "100vw", fontSize: "1.2em" }}>Commemorative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(coin)
                                // .sort((a, b) => coin[a].order > coin[b].ordder ? 1 : -1)
                                .map((key) => {
                                    {return (
                                        Object.values(coin[key])
                                        .map((dataItem) => {
                                            return (
                                                <tr>
                                                    <td style={{ width: "30vw" }}>{key}</td>
                                                    <td style={{ width: "30vw" }}> <img onClick={() => onClick(dataItem.imageUrl, dataItem.title, dataItem.description)} src={dataItem.imageUrl}/></td>
                                                    <td style={{ width: "50vw" }}>{dataItem.title}</td>
                                                </tr>
                                            )
                                        })
                                )}
                                })

                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CoinTable;