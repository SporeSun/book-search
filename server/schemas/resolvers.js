// Import required modules and controller functions
const { User } = require('../models');
const userController = require('./user-controller'); // Assuming user-controller.js

const resolvers = {
  Query: {
    // Resolver for 'me' query
    me: async (_, args, context) => {
      // Assuming context has user information
      if (!context.user) {
        throw new Error('Not logged in');
      }
      return userController.getSingleUser({ user: context.user });
    }
  },

  Mutation: {
    // Resolver for 'addUser' mutation
    addUser: async (_, args) => {
      const { username, email, password } = args;
      return userController.createUser({ body: { username, email, password } });
    },

    // Resolver for 'login' mutation
    login: async (_, args) => {
      const { email, password } = args;
      return userController.login({ body: { email, password } });
    },

    // Resolver for 'saveBook' mutation
    saveBook: async (_, args, context) => {
      // Check for authenticated user
      if (!context.user) {
        throw new Error('Not logged in');
      }
      return userController.saveBook({ user: context.user, body: args.input });
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
