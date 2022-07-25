import "../style/Coins.css";
import '../style/Popup.css';

function Popup ({children, open, onClose, infoPopup}) {

    return !open ? null : 
    <div className="wrapperPop">
        <div className="popDiv">
            <div className="titlePop">
                {infoPopup} 
                <button onClick={onClose}>X</button>
            </div>
            {children}
        </div>
    </div>
}

export default Popup;