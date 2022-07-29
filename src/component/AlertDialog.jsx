import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({onClose, onConfirm, open, title, text}) {

  return (
    !open ? null :
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
