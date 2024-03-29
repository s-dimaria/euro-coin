import {getLoginUser} from '../service/supabase';
import {Navigate} from 'react-router-dom';

function withProtected (Component) {

    return ((...props) => {

        let user = getLoginUser();
        
        return user ? <Navigate to="/albums" replace={true}/> : <Component {...props}/>
    })

}

export default withProtected;