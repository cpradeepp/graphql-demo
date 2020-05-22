const fetch = require('node-fetch');
const { asyncAwait } = require('./../tools')

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const ALL_USERS = `${BASE_URL}/users`;

const fetchAllUsers = async () => {
	const [ error, response ] = await asyncAwait(fetch(ALL_USERS));

	if(error) {
		throw new Error(error);
	}

	return response.json();
};

const fetchOneUser = async (id) => {
	const [ error, response ] = await asyncAwait(fetch(`${ALL_USERS}/${id}`));

	if(error) {
		throw new Error(error);
	}

	return response.json();
};

module.exports = {
	fetchAllUsers,
	fetchOneUser
};