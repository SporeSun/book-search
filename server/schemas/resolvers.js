// Import required modules and controller functions
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')


const resolvers = {
  Query: {
    // Resolver for 'me' query
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    // Resolver for 'addUser' mutation
    addUser: async (parent, { username, email, password}) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Resolver for 'login' mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },

    // Resolver for 'saveBook' mutation
    saveBook: async (_, args, context) => {
      // Check for authenticated user
      if (!context.user) {
        throw new Error('Not logged in'); 
      }
      return User.saveBook({ user: context.user, body: args.input });
    },

    // Resolver for 'removeBook' mutation
    removeBook: async (_, args, context) => {
      // Check for authenticated user
      if (!context.user) {
        throw new Error('Not logged in');
      }
      return userController.deleteBook({ user: context.user, params: args });
    }
  }
};

module.exports = resolvers;
