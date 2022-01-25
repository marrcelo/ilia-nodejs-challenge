import { Schema, model, Document, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  authenticate: (plainTextPassword: string) => boolean;
  encryptPassword: (password: string | undefined) => string;
}

const UserSchema = new Schema(
  {
    first_name: { type: String, trim: true, required: true },
    last_name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.path("email").validate(
  async (email: string) => {
    const emailCount = await models.User.countDocuments({ email });
    return !emailCount;
  },
  "already exists in the database.",
  "DUPLICATED"
);

UserSchema.pre<IUser & Document>("save", function encryptPasswordHook(next) {
  // Hash the password
  if (this.isModified("password")) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

UserSchema.methods = {
  authenticate(plainTextPassword: string) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  },
};

export const UserModel = model<IUser>("User", UserSchema);
