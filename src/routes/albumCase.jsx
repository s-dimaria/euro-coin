import AlbumInteractive from '../component/AlbumInteractive';
import LoadingSpinner from '../info/LoadingSpinner';
import Insert from '../component/Insert';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { getUserInfo, getAlbumCoinByState, getAlbumCommemorative, getStateWithCoins } from '../service/supabase';

function AlbumCase({id, state}) {

    //const { id } = useParams();

    const uuid = getUserInfo().id;
    const [album, setAlbum] = useState([]);
    const [startedYearofStates, setStartedYearOfStates] = useState([])
    const [loading, setLoading] = useState(false);

    const onInsert = (newInsert) => {
        setAlbum([...album, newInsert])
    }

    const onDelete = (deletedCoin) => {
        setAlbum(album.filter(coin => coin !== deletedCoin))
    }

    useEffect(() => {
        console.log(state)
        setLoading(true)
        async function fetchAlbum() {

            setStartedYearOfStates(await getStateWithCoins(state));
            if(id === "euro")
                setAlbum(await getAlbumCoinByState(uuid,state))
            else 
                setAlbum(await getAlbumCommemorative(uuid))

            setLoading(false)
        }
        fetchAlbum()
    }, [id])

    return (
        <>
           {/*  <Insert id={id} onInsert={onInsert}/> */}
            {loading ?
                <LoadingSpinner /> : <AlbumInteractive id={id} album={album} startedYearofStates={startedYearofStates} uuid={uuid} onInsert={onInsert} onDelete={onDelete} />}
        </>
    )
}

export default AlbumCase;