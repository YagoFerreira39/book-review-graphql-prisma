import hashPassword from "../utils/hashPassword";
import generateToken from "../utils/generateToken";

const Mutation = {
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
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User cannot be found or does not exist.");
    }

    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
};

export { Mutation as default };
