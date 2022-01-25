import mongoose, { Mongoose } from "mongoose";

export const connect = async (): Promise<Mongoose> => {
  mongoose.set("debug", Boolean(process.env.MONGO_DEBUG));

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri)
    throw Error(`Invalid MONGO_URI. Informed MONGO_URI:${mongoUri}`);

  return mongoose.connect(mongoUri);
};

export const close = (): Promise<void> => mongoose.connection.close();
