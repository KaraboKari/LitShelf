import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';

// 1. Define the "Shape" of a User in the DB
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage: string;
    comparePassword(password: string): Promise<boolean>; // Add method here too
}

// 2. Define the Method Interface (which you already had)
interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

// 3. Apply types to the Schema
// The order is: <DocType, ModelType, MethodType>
const userSchema = new Schema<IUser, {}, IUserMethods>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profileImage: { type: String, default: "" }
},{timestamps: true});

// 4. The Middleware (Hashing)
// Use 'this: IUser' so TS knows 'this.password' exists
userSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return  
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    
});

// 5. The Method
userSchema.methods.comparePassword = async function (this: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// 6. Export the Model with the IUser type
const User = model<IUser>("User", userSchema);

export default User;