import "../style/Coins.css";
import '../style/Popup.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Popup ({ onClose, open, title, text, image, infoImg}) {

    return open ? 
    <div>
          <Dialog
            open="true"
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle className="titlePopup" id="alert-dialog-title">
              <b>{title}</b>
            </DialogTitle>
            <DialogContent>
              <div className="imgBox">
                <div className="pop-container">
                <div className="pop-image">
                  <img className="imagePop" src={image} modal nested alt=""></img>
                </div>
                <div className="pop-content">
                  <p>{infoImg}</p>
                </div>
              </div>
              </div>
              <DialogContentText id="alert-dialog-description">
                {text}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <div className="disagree">
                <Button onClick={onClose}>Chiudi</Button>
              </div>
            </DialogActions>
          </Dialog>
        </div> : null;
}

export default Popup;