import Insert from '../component/Insert';
import AlbumTable from '../component/AlbumTable';
import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router';

import { getUserInfo, getAlbum } from '../service/supabase';

function Album() {


    return(
        <div className="containerBox">
            <h2>ALBUM</h2>
            <hr/>
            <Outlet/>
        </div>
        
    );
}

export default Album;