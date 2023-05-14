import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAlbumCommemorative, getAlbumCoin, getUserInfo, logout, sendPasswordReset } from "../service/supabase";
import withProtected from "../hoc/withProtected";
import LoadingSpinner from '../info/LoadingSpinner';
import AlertDialog from "../info/AlertDialog";
import '../style/User.css';

function User() {

    const user = getUserInfo();
    const [totalSum, setTotalSum] = useState(0);
    const [coinEuro, setCoinEuro] = useState([]);
    const [coinComm, setCoinComm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        totalValueCoin()
   
    }, [coinEuro, coinComm])


    useEffect(() => {

        let ignore = false;

        async function fetchCoin() {
            
            setLoading(true)
            const coinNoComm = await getAlbumCoin(getUserInfo().id);
            const coinComm = await getAlbumCommemorative(getUserInfo().id);
            if (!ignore) {
                setCoinEuro(coinNoComm);
                setCoinComm(coinComm);
            }
            setLoading(false)
        }
        fetchCoin()

        return () => { ignore = true };
    }, [])

    const totalValueCoin = async () => {
        let sum = 0;
        coinEuro.forEach((value) => {
            switch (value.value) {
                case "1 Centesimo":
                    sum = sum + 0.01;
                    break;
                case "2 Centesimi":
                    sum = sum + 0.02;
                    break;
                case "5 Centesimi":
                    sum = sum + 0.05;
                    break;
                case "10 Centesimi":
                    sum = sum + 0.10;
                    break;
                case "20 Centesimi":
                    sum = sum + 0.20;
                    break;
                case "50 Centesimi":
                    sum = sum + 0.50;
                    break;
                case "1 Euro":
                    sum = sum + 1.00;
                    break;
                case "2 Euro":
                    sum = sum + 2.00;
                    break;
            }

        })

        coinComm.forEach((value) => {
            sum = sum + 2.00
        })

        setTotalSum(sum)
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const onConfirm = () => {
        sendPasswordReset(user.email);
        setOpenDialog(false)
    }

    return (
        <>
            <div className="wrapperCard">
                <div className="cardUser">
                    <div className="row">
                        <div className="col">
                            <span>La tua collezione</span>
                        </div>
                    </div>
                    {loading ? <LoadingSpinner /> :
                        <>
                            <div className="row">
                                <div className="col">
                                    <p>Euro: {coinEuro.length}</p>
                                </div>
                                <div className="col">
                                    <p>Commemorative: {coinComm.length}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p>Totale Valore: {totalSum.toFixed(2)} €</p>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <AlertDialog
                open={openDialog}
                onClose={handleClose}
                title="Password dimenticata?"
                text="Verrà invitata una email di reset password all'indirizzo email dell'account."
                onConfirm={onConfirm} />

        </>
    )

}

export default withProtected(User);