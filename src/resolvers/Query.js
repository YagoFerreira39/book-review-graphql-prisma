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

  book(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        id: args.id,
      },
    };
    return prisma.query.book(opArgs, info);
  },

  groups(parent, args, { prisma }, info) {
    const opArgs = {};

    return prisma.query.groups(opArgs, info);
  },
};

export { Query as default };
