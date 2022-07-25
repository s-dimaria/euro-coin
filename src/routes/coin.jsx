import React, {useEffect, useState} from 'react';
import { Outlet } from 'react-router-dom';
import { getStates } from "../service/supabase";
import { Link } from 'react-router-dom';
import '../style/App.css';

function Coin() {

    const [states, setStates] = useState([]);

    useEffect(() => {

        let ignore = false;
    
        async function startFetching() {
          const json = await getStates();
          if (!ignore) {
            console.info("Done");
            setStates(json)
          }
        }
        startFetching();
    
        return () => { ignore = true };
      }, []);
  

    return(
        <>
        <div className="coinSelectList">
            <ul className="coinList">
            {Object.keys(states)
                .map(element => {
                  return (
                    Object.values(states[element])
                    .map((state) => {
                      return (
                        <li><Link to={`${state}`}>{state}</Link></li>
                      )
                    })
                  )
                }
                ) 
              }
              </ul>
        </div>
        <div className="coinImageList">
            <Outlet />
        </div>
        </>
    );
}

export default Coin;