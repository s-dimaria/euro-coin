import Insert from '../component/Insert';
import AlbumTable from '../component/AlbumTable';
import React, {useState, useEffect} from 'react';

import { getUserInfo, getAlbumCommemorative } from '../service/supabase';

function AlbumCommemorative (){

    const [album, setAlbum] = useState([]);

    const onInsert = (newInsert) => {
        setAlbum([...album,newInsert])
    }

    useEffect(() => {
        async function fetchAlbum() {
            setAlbum(await getAlbumCommemorative(getUserInfo().id))
        }
        fetchAlbum()
    },[])

    return (
        <>  <div>ciao</div>
            {/* <Insert onInsert={onInsert}/> */}
            {/* <AlbumTable album={album}/> */}
        </>
    )
}

export default AlbumCommemorative;