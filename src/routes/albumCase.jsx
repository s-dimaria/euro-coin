import Insert from '../component/Insert';
import AlbumTable from '../component/AlbumTable';
import LoadingSpinner from '../component/LoadingSpinner';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';

import { getUserInfo, getAlbumNoComm, getAlbumCommemorative } from '../service/supabase';

function AlbumCase (){

    const {id} = useParams();

    const uuid = getUserInfo().id;
    const [album, setAlbum] = useState([]);
    const [loading,setLoading] = useState(false);

    const onInsert = (newInsert) => {
        setAlbum([...album,newInsert])
    }

    const onDelete = (deletedCoin) => {
        setAlbum(album.filter(coin => coin!==deletedCoin))
    }

    useEffect(() => {
        setLoading(true)
        async function fetchAlbum() {
            if(id=="euro") {
                setAlbum(await getAlbumNoComm(uuid))
                album.sort((a,b) => a > b ? 1 : -1)
            }
            else {
                setAlbum(await getAlbumCommemorative(uuid))
                album.sort((a,b) => a > b ? 1 : -1)
            }
            setLoading(false)
        }
        fetchAlbum()
    },[id])

    return (
        <>
            <Insert id={id} onInsert={onInsert}/>
            { loading ?
            <LoadingSpinner/>: <AlbumTable id={id} album={album} uuid={uuid} onDelete={onDelete}/> }
        </>
    )
}

export default AlbumCase;