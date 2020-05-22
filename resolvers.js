const { asyncAwait, getUser } = require('./tools')
const { fetchOneUser } = require('./dataFetch')

const getOneUser = async (parent, args) => {
	const { id } = args;
	const [error, response] = await asyncAwait(fetchOneUser ( id ));

	if(error) {
		throw new Error(error);
	}

	return response
};

const resolvers = {
	Query: {
		me: async (parent, args, context, info) => {

			const { authorization } = context.req.headers;
			const [error, result] = await asyncAwait(getUser(authorization));

			if(error || !result) {
				throw new Error('Unauthorized access!');
			}

			return getOneUser(parent, { id: result });
		},

		user: getOneUser,

		department: (parent, args, context, info) => {

		}
	}
}

module.exports = resolvers;