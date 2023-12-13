const { GraphQLSchema } = require("graphql");

const RootQuery = require("./root-query");

module.exports = new GraphQLSchema({
  query: RootQuery,
});
