import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fcbgtjrvluvirbkzmxra.supabase.co'
const supabase = createClient(supabaseUrl, process.env.REACT_APP_SUPABASE_KEY);

const getLoginUser = async () => {
    console.debug("Get User State...")
    const { data } = await supabase.auth.getUser()
    console.debug(!!data.user)

    return !!data.user;
}

const getUserInfo = async () => {
    console.debug("Get User Info...")
    const { data, error } = await supabase.auth.getUser()

    return data.user ? data.user : alert(error.message);
}

const registerWithEmailAndPassword = async (name, email, password) => {

    console.debug("Registration...")
    let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    if (error) return alert(error.message);

    return user;

}

const loginWithEmailAndPassword = async (email, password) => {

    console.debug("Login...")
    let { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) return alert(error.message);

    return user;

}

const loginWithProvider = async (provider) => {

    console.debug("Login Provider...")
    let { user, error } = await supabase.auth.signInWithOAuth({
        provider: provider
    }, {
        redirectTo: "https://s-dimaria.github.io/euro-coin/"
    });
    if (error) return alert(error.message);

    return user;

}

const logout = async () => {

    console.debug("Logout...")
    let { error } = await supabase.auth.signOut();

    if (error) return alert(error.message);

}

const sendPasswordReset = async (email) => {
    console.debug("Password Reset...")
    let { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) return alert(error.message);
    return data;
}

const getStates = async () => {
    console.debug("GET States")
    return (await supabase.from("states_eu").select('state_name, prefix, flagUrl')).data;
}

const getCoinAndCoinCommWithDetail = async (state) => {
    console.debug("GET Coin By States -> " + state)
    return (await supabase.from("states_eu").select('coin, coin_commemorative, detail').eq('state_name', state)).data[0];
}

const getAllStatesWithCoins = async () => {
    return (await supabase.from("states_eu").select('state_name, coin, coin_commemorative')).data;
}

const getStateWithCoins = async (state) => {
    return (await supabase.from("states_eu").select('state_name, coin, coin_commemorative').eq('state_name', state)).data;
}

const getAllCoin = async () => {
    return (await supabase.from("states_eu").select('coin')).data;
}

const getAllCoinCommemorative = async () => {
    return (await supabase.from("states_eu").select('coin_commemorative')).data;
}

const getSingleAlbumCoin = async (state, year, value, uuid) => {
    console.debug(state, year, value, uuid)
    let { data, error } = await supabase
        .from('album_coin')
        .select('state, year, value, letter, user_id')
        .eq('state', state)
        .eq('value', value)
        .eq('year', year)
        .eq('user_id', uuid)
    if (error)
        console.error(error.message)
    else
        return data[0];
}

const putInsertCoin = async (state, year, value, letterOrUuid, maybeUuid) => {
    console.debug("Insert Coin")

    const letter = maybeUuid === undefined ? undefined : letterOrUuid;
    const uuid = maybeUuid === undefined ? letterOrUuid : maybeUuid;

    let initialYear = Object.keys((await supabase
        .from('states_eu')
        .select('coin')
        .eq('state_name', state)).data[0].coin)[0];

    if (year >= initialYear) {
        const insertPayload = {
            state: state,
            year: year,
            value: value,
            user_id: uuid,
            ...(letter ? { letter: letter } : {})
        };

        let { data, error } = await supabase
            .from('album_coin')
            .insert([insertPayload]).select()

        if (error) {
            console.error(error.message);
            return { data: [insertPayload], error };
        }

        return { data: data && data.length ? data : [insertPayload], error: null };
    }

    return { data: [], error: null }
}



const putInsertCoinCommemorative = async (state, year, descr, letterOrUuid, maybeUuid) => {
    console.debug("Insert Coin Commemorative")

    const letter = maybeUuid === undefined ? undefined : letterOrUuid;
    const uuid = maybeUuid === undefined ? letterOrUuid : maybeUuid;
    const payload = {
        state: state,
        year: year,
        description: descr,
        user_id: uuid,
        ...(letter ? { letter: letter } : {}),
        value: "2 Euro"
    };

    let { data, error } = await supabase
        .from('album_commemorative')
        .insert([payload]).select()

    if (error) {
        console.error(error.message);
        return payload;
    }

    return data?.[0] ?? payload;
}

const getFullAlbum = async (uuid) => {
    console.debug("Get Coin of user")
    let data = await supabase
        .from('album_coin')
        .select('state, year, value, letter')
        .eq('user_id', uuid);

    let dataComm = await supabase
        .from('album_commemorative')
        .select('state, year, description, letter')
        .eq('user_id', uuid);
    //data.data = [...data.data, dataComm.data]

    return {data: data.data, dataComm: dataComm.data};
}

const getAlbumCoin = async (uuid) => {
    console.debug("Get Coin of user")
    return (await supabase
        .from('album_coin')
        .select('state, year, value, letter')
        .eq('user_id', uuid)).data;
}

const getAlbumCoinByState = async (uuid, state) => {
    console.debug("Get Coin of user")
    return (await supabase
        .from('album_coin')
        .select('state, year, value, letter')
        .eq('user_id', uuid)
        .eq('state', state)).data;
}

const getAlbumCommemorative = async (uuid) => {
    console.debug("Get Commemorative of user")
    return (await supabase
        .from('album_commemorative')
        .select('state, year, description, letter')
        .eq('user_id', uuid)).data;
}

const getAlbumCommemorativeByState = async (uuid, state) => {
    console.debug("Get Commemorative of user")
    return (await supabase
        .from('album_commemorative')
        .select('state, year, description, letter')
        .eq('user_id', uuid)
        .eq('state', state)).data;
}

const searchAlbumCoins = async (coinageValue, stateName) => {
    console.debug("Search Album Coins...", coinageValue, stateName)
    let query = supabase
        .from('album_coin')
        .select('state, year, value, letter, user_id');
    
    if (coinageValue) {
        query = query.eq('value', coinageValue);
    }
    
    if (stateName) {
        query = query.eq('state', stateName);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error(error.message);
        return [];
    }
    
    return data;
}

const deleteCoin = async (state, year, value, letterOrUuid, maybeUuid) => {
    console.debug("Delete Coin...", state, year, value, letterOrUuid, maybeUuid)
    const letter = maybeUuid === undefined ? undefined : letterOrUuid;
    const uuid = maybeUuid === undefined ? letterOrUuid : maybeUuid;
    const { data, error } = await supabase
        .from('album_coin')
        .delete()
        .match({ state: state, year: year, value: value, ...(letter ? { letter: letter } : {}), user_id: uuid }).select()

    if (error)
        console.debug(error)

    return data[0];
}

const deleteCommemorative = async (state, year, description, letterOrUuid, maybeUuid) => {
    console.debug("Delete Coin Commemmorative...")
    const letter = maybeUuid === undefined ? undefined : letterOrUuid;
    const uuid = maybeUuid === undefined ? letterOrUuid : maybeUuid;
    const { data, error } = await supabase
        .from('album_commemorative')
        .delete()
        .match({ state: state, year: year, description: description, ...(letter ? { letter: letter } : {}), user_id: uuid }).select()

    if (error)
        console.debug(error)

    return data;
}

const subscribeAlbum = (callback) => {
    let subscribe = supabase
        .from('album_coin')
        .on('INSERT', callback)
        .subscribe()

    return subscribe;
}


export {
    getLoginUser,
    getUserInfo,
    getStates,
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithProvider,
    logout,
    sendPasswordReset,
    getCoinAndCoinCommWithDetail,
    getAllStatesWithCoins,
    getAllCoin,
    getAllCoinCommemorative,
    getSingleAlbumCoin,
    putInsertCoin,
    putInsertCoinCommemorative,
    getFullAlbum,
    getAlbumCoin,
    getAlbumCoinByState,
    getAlbumCommemorative,
    getAlbumCommemorativeByState,
    searchAlbumCoins,
    deleteCoin,
    deleteCommemorative,
    subscribeAlbum,
    getStateWithCoins
}