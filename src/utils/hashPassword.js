import bcrypt from "bcryptjs";
/**userInputError apollo server */

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password should contain at least 8 characters");
  }

  return bcrypt.hash(password, 10);
};

export { hashPassword as default };
