import Insert from '../component/Insert';
import AlbumTable from '../component/AlbumTable';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';

import { getUserInfo, getAlbumNoComm, getAlbumCommemorative } from '../service/supabase';

function AlbumCase (){

    const {id} = useParams();

    const [album, setAlbum] = useState([]);

    const onInsert = (newInsert) => {
        setAlbum([...album,newInsert])
    }

    useEffect(() => {
        async function fetchAlbum() {
            if(id=="euro")
                setAlbum(await getAlbumNoComm(getUserInfo().id))
            else
                setAlbum(await getAlbumCommemorative(getUserInfo().id))
        }
        fetchAlbum()
    },[id])

    return (
        <>
            <Insert id={id} onInsert={onInsert}/>
            <AlbumTable id={id} album={album}/>
        </>
    )
}

export default AlbumCase;