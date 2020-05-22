const asyncAwait = (promise) => {
    return promise.then(data=>{
        return [null, data];
    })
    .catch(err=>{
        return [err];
    })
}

const getUser = async (authorization) => {
    const AUTHORIZATION_LOOKUP = {
        "my_user_1": 1 // id of the user
    };

    return AUTHORIZATION_LOOKUP[authorization] || null;
}

module.exports = {
	asyncAwait,
	getUser
}