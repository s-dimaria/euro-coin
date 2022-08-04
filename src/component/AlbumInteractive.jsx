import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { values, valuesComm } from '../utils/constants';
import { putInsertCoin, deleteCoin, deleteCommemorative } from '../service/supabase';
import CustomizedSnackbars from './CustomizedSnackbar';
import AlertDialog from './AlertDialog';
import '../style/AlbumTable.css';

function AlbumInteractive({ id, uuid, album, albumComm, startedYearofStates, onInsert, onDelete }) {

    const [coin, setCoin] = useState(null);
    const [deletedCoin, setDeletedCoin] = useState(null);

    const [open, setOpen] = useState(false);
    const [stateToNavigate, setStateToNavigate] = useState("");
    const [img, setImg] = useState("")

    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("info");

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false)
        setCoin(null)
        setDeletedCoin(null)
        setStateToNavigate("")
    };

    const onConfirmDelete = async () => {

        id === "euro" ?
            await deleteCoin(
                deletedCoin.state,
                deletedCoin.year,
                deletedCoin.value,
                uuid).then(() =>
                    onDelete(deletedCoin)
                ).then(() => {
                    setDeletedCoin(null)
                    setCoin(null)
                    setOpen(true)
                    setText("Moneta '" + deletedCoin.state + " " + deletedCoin.year + " " + deletedCoin.value + "' eliminata")
                    setSeverity("info")
                }) :
            await deleteCommemorative(
                deletedCoin.state,
                deletedCoin.year,
                deletedCoin.description,
                uuid).then((data) => {
                    onDelete(data)
                }).then(() => {
                    setDeletedCoin(null)
                    setCoin(null)
                    setOpen(true)
                    setText("Moneta '" + deletedCoin.state + " " + deletedCoin.year + " " + deletedCoin.description + "' eliminata")
                    setSeverity("info")
                })
    }

    const onConfirm = async () => {
        await putInsertCoin(
            coin.state,
            coin.year,
            coin.value,
            uuid
        ).then((data) => onInsert(data))
            .then(() => {
                setCoin(null)
                setDeletedCoin(null)
                setOpen(true)
                setText("Moneta '" + coin.state + " - " + coin.year + " - " + coin.value + "' inserita nell'album")
                setSeverity("success")
            })
    }

    const navigateToState = () => {
        navigate(`/app/coin/${stateToNavigate}`, { replace: true })
    }

    const getYears = (initYear) => {
        const thisYear = new Date().getFullYear();
        const retval = [];
        for (let i = parseInt(initYear); i <= thisYear; i++) retval.push(i)
        return retval
    }


    const imageSelect = (yearValue, years) => {

        for (let i = 0; i <= years.length; i++) {
            if (yearValue >= years[years.length - 1])
                // return (<img src={startedYearofStates[key].coin[years[years.length - 1]][value].imageUrl}></img>)
                return years[years.length - 1]
            if (yearValue >= years[i] && yearValue < years[i + 1])
                // return (<img src={startedYearofStates[key].coin[years[i]][value].imageUrl}></img>)
                return years[i]
        }
    }



    return (

        <>
            {
                Object.keys(startedYearofStates)
                    .sort((a, b) => startedYearofStates[a].state_name > startedYearofStates[b].state_name ? 1 : -1)
                    .map((key) => {
                        let state = startedYearofStates[key].state_name;
                        let years;


                        if (id === "euro") {
                            years = Object.keys(startedYearofStates[key].coin);
                            console.log("Euro")
                            if (years.length === 1) {
                                return (
                                    <>
                                        <h2>{state}</h2>
                                        <hr />
                                        <div className="containerGrid">
                                            {getYears(years[0]).map((yearValue) => {
                                                return (
                                                    <div className="rowAlbum">
                                                        <>
                                                            <div className="firstColumn">
                                                                <span>{yearValue}</span>
                                                            </div>
                                                            <div>
                                                                {Object.keys(values)
                                                                    .map((value) =>
                                                                        album.find((data) => (
                                                                            data.state === state &&
                                                                            data.year === yearValue &&
                                                                            data.value === values[value]
                                                                        )) ?
                                                                            <button disabled>
                                                                                <img src={startedYearofStates[key].coin[years[0]][value].imageUrl}
                                                                                    onClick={() => {
                                                                                        setTitle("Eliminare la moneta '" + state + " " + yearValue + " " + values[value] + "' ?")
                                                                                        setDeletedCoin({ state: state, year: yearValue, value: values[value] })
                                                                                        setImg(startedYearofStates[key].coin[years[0]][value].imageUrl)
                                                                                    }}>
                                                                                </img>
                                                                            </button> :
                                                                            <button onClick={() => {
                                                                                setTitle("Inserire la moneta '" + state + " " + yearValue + " " + values[value] + "' ?")
                                                                                setCoin({ state: state, year: yearValue, value: values[value] })
                                                                            }}>
                                                                            </button>)}
                                                            </div>

                                                        </></div>)
                                            })}
                                        </div>
                                    </>
                                )
                            }
                            else {
                                return (
                                    <>
                                        <h2>{state}</h2>
                                        <hr />
                                        <div className="containerGrid">
                                            {getYears(years[0]).map((yearValue) => {
                                                return (
                                                    <div className="rowAlbum">
                                                        <>
                                                            <div className="firstColumn">
                                                                <span>{yearValue}</span>
                                                            </div>
                                                            <div>
                                                                {Object.keys(values)
                                                                    .map((value) =>
                                                                        album.find((data) => (
                                                                            data.state === state &&
                                                                            data.year === yearValue &&
                                                                            data.value === values[value]
                                                                        )) ?
                                                                            // findCoin(state, yearValue, values[value]) ?
                                                                            <button disabled>
                                                                                <img src={startedYearofStates[key].coin[imageSelect(yearValue, years)][value].imageUrl}
                                                                                    onClick={() => {
                                                                                        setTitle("Eliminare la moneta '" + state + " " + yearValue + " " + values[value] + "' ?")
                                                                                        setDeletedCoin({ state: state, year: yearValue, value: values[value] })
                                                                                        setImg(startedYearofStates[key].coin[imageSelect(yearValue, years)][value].imageUrl)
                                                                                    }}>
                                                                                </img>
                                                                            </button> :
                                                                            <button onClick={() => {
                                                                                setTitle("Inserire la moneta '" + state + " " + yearValue + " " + values[value] + "' ?")
                                                                                setCoin({ state: state, year: yearValue, value: values[value] })
                                                                            }}>
                                                                            </button>)}
                                                            </div>

                                                        </></div>)
                                            })}
                                        </div>
                                    </>
                                )
                            }

                        }
                        else {
                            console.log("Commemorative")
                            years = Object.keys(startedYearofStates[key].coin_commemorative);
                            return (
                                <>
                                    <h2>{state}</h2>
                                    <hr />
                                    <div className="containerGrid">
                                        {getYears(years[0]).map((yearValue) => {
                                            return (
                                                <div className="rowAlbum">
                                                    <>
                                                        <div className="firstColumn">
                                                            <span>{yearValue}</span>
                                                        </div>
                                                        <div>
                                                            {valuesComm
                                                                .map((value) =>
                                                                    albumComm.find((data) => (
                                                                        data.state === state &&
                                                                        data.year === yearValue &&
                                                                        data.description === startedYearofStates[key].coin_commemorative[yearValue][value].title
                                                                    )) ?
                                                                        // findCoin(state, yearValue, "2 Euro", startedYearofStates[key].coin_commemorative[yearValue][value].title) ?
                                                                        <button disabled>
                                                                            <img src={startedYearofStates[key].coin_commemorative[yearValue][value].imageUrl}
                                                                                onClick={() => {
                                                                                    setTitle("Eliminare la moneta '" + state + " " + yearValue + " " + startedYearofStates[key].coin_commemorative[yearValue][value].title + "' ?")
                                                                                    setDeletedCoin({ state: state, year: yearValue, description: startedYearofStates[key].coin_commemorative[yearValue][value].title })
                                                                                    setImg(startedYearofStates[key].coin_commemorative[yearValue][value].imageUrl)
                                                                                }}>
                                                                            </img>
                                                                        </button> :
                                                                        <button onClick={() => {
                                                                            setTitle(`Inserire una moneta commemorativa dello stato ${state}?`)
                                                                            setStateToNavigate(state)
                                                                        }}>
                                                                        </button>)}
                                                        </div>

                                                    </></div>)
                                        })}
                                    </div>
                                </>
                            )
                        }
                    })
            }
            <AlertDialog onClose={handleClose} onConfirm={onConfirm} open={coin}
                title={title}
                text="Attenzione stai per inserire una moneta. La conferma comporterà la modifica del tuo album." />
            <AlertDialog onClose={handleClose} onConfirm={onConfirmDelete} open={deletedCoin}
                title={title}
                image={img}
                text="Attenzione stai per eliminare una moneta. La conferma comporterà la modifica del tuo album." />
            <AlertDialog onClose={handleClose} onConfirm={navigateToState} open={stateToNavigate}
                title={title}
                textConfirm="Procedi"
                text={<><p>Per inserire una nuova moneta commemorativa, spostati nella sezione 'Monete' e seleziona lo stato della moneta commemorativa.</p><p>Premi il tasto 'Procedi' per spostarti rapidamente nella sezione.</p></>} />
            <CustomizedSnackbars open={open} onClose={handleClose} text={text} severity={severity} />
        </>)

}

export default AlbumInteractive;