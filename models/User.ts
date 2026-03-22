import mongoose, {
  Schema,
  Document,
  Model,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  fullName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  password?: string;
  phone?: string;
  role: "user" | "admin";
  companyId: mongoose.Types.ObjectId | string;
  addresses: IAddress[];
  defaultBillingAddress?: string;
  defaultShippingAddress?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String, select: false },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    addresses: { type: [AddressSchema], default: [] },
    defaultBillingAddress: { type: String },
    defaultShippingAddress: { type: String },
    provider: { type: String },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
