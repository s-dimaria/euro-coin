import React from 'react';
import { Outlet } from 'react-router';

function Album() {


    return(
        <div className="containerBox">
            {/* <h2>ALBUM</h2>
            <hr/> */}
            <Outlet/>
        </div>
        
    );
}

export default Album;