import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  if (!userId) {
    throw new Error("User not found.");
  }

  const validToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  return validToken;
};

export { generateToken as default };
