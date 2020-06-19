const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    return prisma.query.users(opArgs, info);
  },

  authors(parent, args, { prisma }, info) {
    const opArgs = {};

    return prisma.query.authors(opArgs, info);
  },

  books(parent, args, { prisma }, info) {
    const opArgs = {};

    return prisma.query.books(opArgs, info);
  },
};

export { Query as default };
