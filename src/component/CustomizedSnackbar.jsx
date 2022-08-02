import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({text, onClose, open, severity}) {

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        onClose={onClose} 
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
        TransitionComponent={SlideTransition}
        >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
