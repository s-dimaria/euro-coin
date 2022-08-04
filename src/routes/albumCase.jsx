import Insert from '../component/Insert';
import AlbumInteractive from '../component/AlbumInteractive';
import AlbumTable from '../component/AlbumTable';
import LoadingSpinner from '../component/LoadingSpinner';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';

import { getUserInfo, getAlbumCoin, getAlbumCommemorative, getAllCoin, getAllCoinCommemorative } from '../service/supabase';

function AlbumCase (){

    const {id} = useParams();

    const uuid = getUserInfo().id;
    const [album, setAlbum] = useState([]);
    const [albumComm, setAlbumComm] = useState([]);
    const [startedYearofStates, setStartedYearOfStates] = useState([])
    const [loading,setLoading] = useState(false);

    const onInsert = (newInsert) => {
        setAlbum([...album,newInsert])
    }

    const onDelete = (deletedCoin) => {
        id === "euro" ?
        setAlbum(album.filter(coin => coin!==deletedCoin)) :
        setAlbumComm(albumComm.filter(coin => coin!==deletedCoin))
    }

    useEffect(() => {
        setLoading(true)
        async function fetchAlbum() {
            setStartedYearOfStates(await getAllCoin());
            
                setAlbum(await getAlbumCoin(uuid))
                // album.sort((a,b) => a > b ? 1 : -1)
                setAlbumComm(await getAlbumCommemorative(uuid))
                // setStartedYearOfStates(await getAllCoinCommemorative());
                // album.sort((a,b) => a > b ? 1 : -1)
            
            setLoading(false)
        }
        fetchAlbum()
    },[id])

    console.log(album)

    return (
        <>
            {/* <Insert id={id} onInsert={onInsert}/> */}
            { loading ?
            <LoadingSpinner/> : <AlbumInteractive id={id} album={album} albumComm={albumComm} startedYearofStates={startedYearofStates} uuid={uuid} onInsert={onInsert} onDelete={onDelete}/> }
        </>
    )
}

export default AlbumCase;