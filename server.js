const { ApolloServer, ApolloError, ValidationError, SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require("graphql");
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const env = require('dotenv');
const { asyncAwait, getUser } = require('./tools');

class isUserAuthorized extends SchemaDirectiveVisitor {
	visitFieldDefinition(field, details) {
		field.secureField = true;
		this.secureFields(details.objectType);
	}

	visitObject(type) {
		this.secureFields(type);
	}

	async secureFields(objectType) {
		const fields = objectType.getFields();

		Object.keys(fields).forEach(async fieldName => {
			const field = fields[fieldName];
			const { resolve = defaultFieldResolver } = field;
			field.resolve = async function (...args) {

				const context = args[2];
				const { req: { headers } } = context;
				const { authorization, apitoken } = headers;

				if(authorization) {
					const [error, result] = await asyncAwait(getUser(authorization));

					if(error) {
						throw new Error('Unauthorized access!');
					}
				}

				if(field.secureField && apitoken && apitoken !== process.env.API_KEY) {
					return null
				}

				return resolve.apply(this, args);
			};
		});
	}

}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res }),
	schemaDirectives: {
		isUserAuthorized: isUserAuthorized
	}
});

env.config();
server.listen()
.then(( {url} ) => {
	console.log(`Server running on ${url}`);
})