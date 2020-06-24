import hashPassword from "../utils/hashPassword";
import generateToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";
import bcrypt from "bcryptjs";

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("User cannot be found.");
    }

    const validPassword = await bcrypt.compare(
      args.data.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email already in use");
    }

    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        name: args.data.name,
        email: args.data.email,
        password: await hashPassword(args.data.password),
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User cannot be found or does not exist.");
    }

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },

  async createAuthor(parent, args, { prisma }, info) {
    return prisma.mutation.createAuthor(
      {
        data: {
          name: args.data.name,
          about: args.data.about,
        },
      },
      info
    );
  },
  async deleteAuthor(parent, args, { prisma }, info) {
    const authorExists = await prisma.exists.Author({ id: args.id });

    if (!authorExists) {
      throw new Error("Author cannot be found.");
    }

    return prisma.mutation.deleteAuthor(
      {
        where: {
          id: args.data.id,
        },
      },
      info
    );
  },
  async updateAuthor(parent, args, { prisma }, info) {
    return prisma.mutation.updateAuthor(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },

  async createBook(parent, args, { prisma }, info) {
    return prisma.mutation.createBook(
      {
        data: {
          title: args.data.title,
          sinopse: args.data.sinopse,
          published: args.data.published,
          genre: args.data.genre,
          pages: args.data.pages,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    );
  },
  async deleteBook(parent, args, { prisma }, info) {
    const bookExists = await prisma.exists.Book({ id: args.id });

    if (!bookExists) {
      throw new Error("Book cannot be found.");
    }

    return prisma.mutation.deleteBook(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateBook(parent, args, { prisma }, info) {
    return prisma.mutation.updateBook(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },

  async shelfList(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const chose = args.chose;
    const bookExists = await prisma.exists.Book({ id: args.id });
    if (!bookExists) {
      throw new Error("Book cannot be found.");
    }

    const wantListed = await prisma.exists.User({
      id: userId,
      wantToRead_some: {
        id: args.id,
      },
    });
    const currentListed = await prisma.exists.User({
      id: userId,
      currentRead_some: {
        id: args.id,
      },
    });
    const completeListed = await prisma.exists.User({
      id: userId,
      completeRead_some: {
        id: args.id,
      },
    });

    const changeList = async (bookId) => {
      if (wantListed) {
        await prisma.mutation.updateUser({
          where: {
            id: userId,
          },
          data: {
            wantToRead: {
              disconnect: { id: bookId },
            },
          },
        });
      } else if (currentListed) {
        await prisma.mutation.updateUser({
          where: {
            id: userId,
          },
          data: {
            currentRead: {
              disconnect: { id: bookId },
            },
          },
        });
      } else if (completeListed) {
        await prisma.mutation.updateUser({
          where: {
            id: userId,
          },
          data: {
            completeRead: {
              disconnect: { id: bookId },
            },
          },
        });
      }
    };

    const book = await prisma.query.books({
      where: {
        id: args.id,
      },
    });

    if (!book) {
      throw new Error("Book cannot be found.");
    }

    if (chose === "WantToRead") {
      if (wantListed) {
        throw new Error("Already in list");
      } else if (currentListed || completeListed) {
        changeList(args.id);
      }
      return prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: {
            wantToRead: {
              connect: {
                id: args.id,
              },
            },
          },
        },
        info
      );
    } else if (chose === "CurrentRead") {
      if (currentListed) {
        throw new Error("Already in list");
      } else if (completeListed || wantListed) {
        changeList(args.id);
      }
      return prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: {
            currentRead: {
              connect: {
                id: args.id,
              },
            },
          },
        },
        info
      );
    } else if (chose === "CompleteRead") {
      if (completeListed) {
        throw new Error("Already in list");
      } else if (wantListed || currentListed) {
        changeList(args.id);
      }
      return prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: {
            completeRead: {
              connect: {
                id: args.id,
              },
            },
          },
        },
        info
      );
    }
  },
};

export { Mutation as default };
