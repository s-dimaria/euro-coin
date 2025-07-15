import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ onClose, onConfirm, open, title, text, image, infoImg, textConfirm, textClose}) {

  return (
    !open ? null :
      image === undefined ?
        <div>
          <Dialog
            open="true"
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {text}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <div className="disagree">
                <Button onClick={onClose}>{textClose || "Annulla"}</Button>
              </div>
              <Button onClick={onConfirm}>
                {textConfirm || "Conferma"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        : <div>
          <Dialog
            open="true"
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle className="titlePopup" id="alert-dialog-title">
              {title}
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
                <Button onClick={onClose}>Annulla</Button>
              </div>
              <Button onClick={onConfirm}>
                Conferma
              </Button>
            </DialogActions>
          </Dialog>
        </div>
  );
}
