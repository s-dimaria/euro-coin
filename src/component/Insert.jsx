import {useState} from 'react';
import values from '../utils/constants';
import '../style/Coins.css';
import '../style/Insert.css';

import { putInsertCoin, putInsertCoinCommemorative, getUserInfo } from '../service/supabase';

function Input({ label, value, onChange, type}) {

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
                onChange={onChange}
            ></input>
            }
        </div>
    );
}

function SelectInput({ label, value, onChange}) {

    return (
        <div className="insertColumn">
            <label>{label}</label>
            {
            <select value={value} onChange={onChange}>
                {Object.keys(values).map(element => <option value={values[element]}>{values[element]}</option>)}
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

    const [state, setState] = useState(null);
    const [year, setYear] = useState("1999");
    const [value, setValue] = useState("1 Centesimo");
    const [description, setDescription] = useState(null);

    const putCoin = async () => {
        let userId = getUserInfo().id;
        let coin = await putInsertCoin(state,year,value,userId)
        if(coin)
            onInsert(coin)
    }

    const putCoinCommemorative = async () => {
        let userId = getUserInfo().id;
        let coin = await putInsertCoinCommemorative(state,year,"2 Euro","true",description,userId)
        if(coin)
            onInsert(coin)
    }
    
    return (
        <>
            {id=="euro" ? 
            <div className="containerBox">
                <div className="rowBox">
                    <Input label="Stato:" value={state} type="text" onChange={(event) => setState(event.target.value)}></Input>
                    <Input label="Anno:" value={year} type="number" onChange={(event) => setYear(event.target.value)}></Input>
                    <SelectInput label="Valore:"  value={value} onChange={(event) => setValue(event.target.value)}></SelectInput>
                    {/* <Input label="Commemorativa:"  checked={checked} type="checkbox" onChange={() => setChecked(!checked)}></Input> */}
                </div>
                <div>
                    <Button label="Inserisci moneta euro" onClick={putCoin}/>
                </div>
            </div>   :
            <div className="containerBox">
                <div className="rowBox">
                    <Input label="Stato:" value={state} type="text" onChange={(event) => setState(event.target.value)}></Input>
                    <Input label="Anno:" value={year} type="number" onChange={(event) => setYear(event.target.value)}></Input>
                    <Input label="Descrizione:"  value={description} onChange={(event) => setDescription(event.target.value)}></Input>
                    {/* <Button onClick={putCoinCommemorative}/> */}
                </div>  
                <div>
                    <Button label="Inserisci moneta commemorativa" onClick={putCoinCommemorative}/>
                </div>
            </div>
            }
        </>
              

    )
}

export default Insert;