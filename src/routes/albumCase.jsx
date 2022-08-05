import AlbumInteractive from '../component/AlbumInteractive';
import LoadingSpinner from '../info/LoadingSpinner';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { getUserInfo, getAlbumCoin, getAlbumCommemorative, getAllStatesWithCoins } from '../service/supabase';

function AlbumCase() {

    const { id } = useParams();

    const uuid = getUserInfo().id;
    const [album, setAlbum] = useState([]);
    const [albumComm, setAlbumComm] = useState([]);
    const [startedYearofStates, setStartedYearOfStates] = useState([])
    const [loading, setLoading] = useState(false);

    const onInsert = (newInsert) => {
        setAlbum([...album, newInsert])
    }

    const onDelete = (deletedCoin) => {
        console.log(deletedCoin)
        id === "euro" ?
            setAlbum(album.filter(coin => coin !== deletedCoin)) :
            setAlbumComm(albumComm.filter(coin => coin !== deletedCoin))
    }

    useEffect(() => {
        setLoading(true)
        async function fetchAlbum() {

            setStartedYearOfStates(await getAllStatesWithCoins());
            if(id === "euro")
                setAlbum(await getAlbumCoin(uuid))
            else 
                setAlbum(await getAlbumCommemorative(uuid))

            setLoading(false)
        }
        fetchAlbum()
    }, [id])

    return (
        <>
            {/* <Insert id={id} onInsert={onInsert}/> */}
            {loading ?
                <LoadingSpinner /> : <AlbumInteractive id={id} album={album} startedYearofStates={startedYearofStates} uuid={uuid} onInsert={onInsert} onDelete={onDelete} />}
        </>
    )
}

export default AlbumCase;