import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one!",
    userId: "1",
  },
  {
    id: "3",
    text: "third one!",
    userId: "3",
  },
];

let users = [
  {
    id: "1",
    firstName: "dongjin",
    lastName: "je",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
  {
    id: "3",
    firstName: "Michel",
    lastName: "Jackson",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Twwet object represets a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]
    movie(id: ID!): Movie
    allUsers: [User!]!
    allTweets: [Tweet!]
    tweet(id: ID!): Tweet
    ping: String
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found. else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(args);
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers(_, arg) {
      console.log("all users called");
      return users;
    },
    allMovies() {
      return fetch(`https://yts.mx/api/v2/list_movies.json`)
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },

  Mutation: {
    postTweet(_, { text, userId }) {
      try {
        if (!users.find((user) => user.userId === userId))
          throw new Error(`${userId} is not find`);

        const newTweet = {
          id: tweets.length + 1,
          text,
        };
        tweets.push(newTweet);
        return newTweet;
      } catch (e) {
        console.log(e);
      }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id != id);
      return true;
    },
  },
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      return firstName + " " + lastName;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
