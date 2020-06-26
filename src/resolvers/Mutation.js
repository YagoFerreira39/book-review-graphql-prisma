import hashPassword from "../utils/hashPassword";
import generateToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";
import bcrypt from "bcryptjs";

const Mutation = {
  /**User Mutation */
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

  /**Author Mutation */
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

  /**Book Mutation */
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

  /**Review Mutation */
  async createReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const bookExists = await prisma.exists.Book({
      id: args.data.book,
    });
    if (!bookExists) {
      throw new Error("Book cannot be found");
    }

    return prisma.mutation.createReview(
      {
        data: {
          text: args.data.text,
          rating: args.data.rating,
          likes: args.data.likes,
          author: {
            connect: {
              id: userId,
            },
          },
          book: {
            connect: {
              id: args.data.book,
            },
          },
        },
      },
      info
    );
  },
  async updateReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const reviewExists = await prisma.exists.Review({
      id: args.id,
    });
    if (!reviewExists) {
      throw new Error("Review cannot be found");
    }

    return prisma.mutation.updateReview(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },

  /**Group Mutation */
  async createGroup(parent, args, { prisma, request }, info) {
    const adminId = getUserId(request);

    const newGroup = await prisma.mutation.createGroup(
      {
        data: {
          name: args.data.name,
          description: args.data.description,
          imageFile: args.data.imageFile,
          admin: {
            connect: {
              id: adminId,
            },
          },
          members: {
            connect: {
              id: adminId,
            },
          },
        },
      },
      info
    );
    await prisma.mutation.updateUser({
      where: { id: adminId },
      data: {
        groups: {
          connect: {
            id: newGroup.id,
          },
        },
      },
    });

    return newGroup;
  },
  async deleteGroup(parent, args, { prisma, request }, info) {
    const adminId = getUserId(request);
    const groupExists = await prisma.exists.Group({
      id: args.id,
      admin_some: { id: adminId },
    });

    if (!groupExists) {
      throw new Error("Group cannot be found.");
    }

    return prisma.mutation.deleteGroup(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateGroup(parent, args, { prisma, request }, info) {
    const adminId = getUserId(request);
    const groupExists = await prisma.exists.Group({
      id: args.id,
      admin_some: { id: adminId },
    });

    if (!groupExists) {
      throw new Error("Group cannot be found.");
    }

    return prisma.mutation.updateGroup(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  /**Adding and removing members */
  async membersToGroup(parent, args, { prisma, request }, info) {
    const adminId = getUserId(request);
    const groupExists = await prisma.exists.Group({
      id: args.id,
      admin_some: { id: adminId },
    });

    if (!groupExists) {
      throw new Error("Group cannot be found.");
    }

    if (args.option === "ADD") {
      await prisma.mutation.updateUser({
        where: { id: args.member },
        data: {
          groups: {
            connect: {
              id: args.id,
            },
          },
        },
      });
      return prisma.mutation.updateGroup(
        {
          where: { id: args.id },
          data: {},
          members: {
            connect: { id: args.member },
          },
        },
        info
      );
    }
    if (args.option === "REMOVE") {
      const memberExists = await prisma.exists.Group({
        id: args.id,
        admin_some: { id: adminId },
        members_some: { id: args.member },
      });
      if (!memberExists) {
        throw new Error("Member cannot be found in the group.");
      }

      await prisma.mutation.updateUser({
        where: { id: args.member },
        data: {
          groups: {
            disconnect: {
              id: args.id,
            },
          },
        },
      });
      return prisma.mutation.updateGroup(
        {
          where: { id: args.id },
          members: {
            disconnect: { id: args.member },
          },
          admin: {
            disconnect: { id: args.member },
          },
          data: {},
        },
        info
      );
    }
    if (args.option === "ADMIN") {
      const memberExists = await prisma.exists.Group({
        id: args.id,
        admin_some: { id: adminId },
        members_some: { id: args.member },
      });
      if (!memberExists) {
        throw new Error("Member cannot be found in the group.");
      }
      return prisma.mutation.updateGroup(
        {
          where: { id: args.id },
          data: {},
          admin: {
            connect: { id: args.member },
          },
        },
        info
      );
    }
  },

  /**Shelf Mutation */
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
