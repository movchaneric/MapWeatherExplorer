const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} = require("graphql");

const mainType = new GraphQLObjectType({
  name: "Main",
  fields: {
    temp: { type: GraphQLFloat },
    feels_like: { type: GraphQLFloat },
    temp_min: { type: GraphQLFloat },
    temp_max: { type: GraphQLFloat },
    pressure: { type: GraphQLInt },
    humidity: { type: GraphQLInt },
    sea_level: { type: GraphQLInt },
    grnd_level: { type: GraphQLInt },
  },
});

const weatherType = new GraphQLObjectType({
  name: "weather",
  fields: {
    id: {
      type: GraphQLID,
    },
    main: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    icon: {
      type: GraphQLString,
    },
  },
});

const CoordType = new GraphQLObjectType({
  name: "Coord",
  fields: {
    lon: {
      type: GraphQLNonNull(GraphQLFloat),
    },
    lat: { type: GraphQLNonNull(GraphQLFloat) },
  },
});

const weatherLatLon = new GraphQLObjectType({
  name: "CurrentWeather",
  fields: () => ({
    coord: {
      type: CoordType,
    },
    weather: {
      type: new GraphQLList(weatherType),
    },
    main: {
      type: mainType,
    },
  }),
});

module.exports = weatherLatLon;
