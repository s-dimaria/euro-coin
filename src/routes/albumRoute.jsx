import { Link } from 'react-router-dom';

function AlbumRoute() {

    return (
        <div className="wrapper_accessPage" style={{color:"black"}}>
            <div className="accessPage">
                <div className="accessPage_container">
                    <div className="accessPage_header">
                        <h2><b>Euro</b></h2>
                        <p>Inizia la tua collezione di monete Euro. Premi sul pulsante per aprire il tuo album di Euro.</p>
                    </div>
                    <Link to="euro"><button className="accessPage_btn">Naviga</button></Link>
                </div>
            </div>
            <div className="accessPage">
                <div className="accessPage_container">
                    <div className="accessPage_header">
                        <h2><b>Commemorative</b></h2>
                        <p>Inizia la tua collezione di monete Commemorative. Premi sul pulsante per aprire il tuo album di Commemorative.</p>
                    </div>
                    <Link to="commemorative"><button className="accessPage_btn">Naviga</button></Link>
                </div>
            </div>
        </div>

    )
}

export default AlbumRoute;