import {useState} from 'react';
import { values, states} from '../utils/constants';

import '../style/Coins.css';
import '../style/Insert.css';

import { putInsertCoin, putInsertCoinCommemorative, getUserInfo } from '../service/supabase';
import CustomizedSnackbars from './CustomizedSnackbar';

function Input({ label, value, onChange, type, max}) {

    return (
        <div className="insertColumn">
            <label>{label}</label>
            {
            type === "text" ?
            <input
                value={value}
                type={type}
                onChange={onChange}
            ></input>
            : <input
                value={value}
                type={type}
                min="1999"
                max={max}
                onChange={onChange}
            ></input>
            }
        </div>
    );
}

function SelectInput({ label, value, onChange, element}) {
    return (
        <div className="insertColumn">
            <label>{label}</label>
            {
            <select value={value} onChange={onChange}>
                {Object.keys(element)
                .sort((a,b) => element[a]>element[b] ? 1: -1)
                .map(value => <option value={element[value]}>{element[value]}</option>)}
            </select>
            }
        </div>
    );
}

function Button({label, onClick}) {

    return (
        <div className="insertColumn">
            <button onClick={onClick}>{label}</button>
        </div>
    );
}

function Insert({id, onInsert}) {

    const d = new Date();

    const [state, setState] = useState("Andorra");
    const [year, setYear] = useState(1999);
    const [value, setValue] = useState("1 Centesimo");
    const [description, setDescription] = useState("");

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const [text, setText] = useState("");

    const handleClose = () => {
        setOpen(false);
    };


    const putCoin = async () => {
        let userId = getUserInfo().id;
        if(year > 1998 && year < d.getFullYear()+1) {
            let coin = await putInsertCoin(state,year,value,userId)
            if(coin) {
                setOpen(true)
                onInsert(coin)
                setText("Moneta aggiunta con successo!")
                setSeverity("success")
            }
            else {
                setOpen(true)
                setText("Operazione annullata! Moneta duplicata")
                setSeverity("error")
            }
        }
        else {
            setOpen(true)
            setText("Operazione annullata! Campi non correttamente inseriti")
            setSeverity("error")
        }
    }

    const putCoinCommemorative = async () => {
        let userId = getUserInfo().id;
        if(year > 1998 && year < d.getFullYear()+1 && description!=="") {
            let coin = await putInsertCoinCommemorative(state,year,description,userId);
            if(coin) {
                setOpen(true)
                onInsert(coin)
                setText("Moneta aggiunta con successo!")
                setSeverity("success")
            }
            else {
                setOpen(true)
                setText("Operazione annullata! Moneta duplicata")
                setSeverity("error")
            }
        }
        else {
            setOpen(true)
            setText("Operazione annullata! Campi non correttamente inseriti")
            setSeverity("error")
        }
    }
    
    return (
        <>
            {id==="euro" ? 
            <div className="containerBox">
                <div className="rowBox">
                    <SelectInput label="Stato:" element={states} value={state} onChange={(event) => setState(event.target.value)}></SelectInput>
                    <Input label="Anno:" value={year} type="number" max={d.getFullYear()} onChange={(event) => setYear(event.target.value)}></Input>
                    <SelectInput label="Valore:"  element={values} value={value} onChange={(event) => setValue(event.target.value)}></SelectInput>
                </div>
                <div>
                    <Button label="Inserisci moneta euro" onClick={putCoin}/>
                    <CustomizedSnackbars text= {text} severity={severity} open={open} onClose={handleClose} />
                </div>
            </div>   :
            <div className="containerBox">
                <div className="rowBox">
                    <SelectInput label="Stato:" element={states} value={state} onChange={(event) => setState(event.target.value)}></SelectInput>
                    <Input label="Anno:" value={year} type="number" max={d.getFullYear()} onChange={(event) => setYear(event.target.value)}></Input>
                    <Input label="Descrizione:"  value={description} onChange={(event) => setDescription(event.target.value)}></Input>
                </div>  
                <div>
                    <Button label="Inserisci moneta commemorativa" onClick={putCoinCommemorative}/>
                    <CustomizedSnackbars text= {text} severity={severity} open={open} onClose={handleClose} />
                </div>
            </div>
            }
        </>
              

    )
}

export default Insert;