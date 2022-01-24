import jwt from "jsonwebtoken";

export const generateToken = (sub: string) => {
  if (!process.env.JWT_KEY) throw Error("NO JWT_KEY!");
  return jwt.sign({ sub }, process.env.JWT_KEY, { expiresIn: "1d" });
};

export const decodeToken = (token: string) => {
  if (!process.env.JWT_KEY) throw Error("NO JWT_KEY!");
  return jwt.verify(token, process.env.JWT_KEY);
};
