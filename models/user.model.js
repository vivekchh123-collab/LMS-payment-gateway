import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";
import { kMaxLength } from "buffer";
import { match } from "assert";
import strict from "assert/strict";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
    maxLength: [40, "Name should not be more than 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    trim: true,
    unique: [true, "Email already exists"],
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "passowrd is required"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: {
      value: ["student", "instructer", "admin"],
      message: "Please select a valid role",
    },
    default: "student",
  },
  avatar: {
    type: String,
    default: "default-avatar.png",
  },
  bio: {
    type: String,
    maxLength: [200, "Bio cannot exceed 200 characters"],
  },
  enrolledCourses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ],
resetPasswordToken: String,
resetPasswordExpire: Date,lastActive:{
  type: Date,
  default: Date.now
}


},{
  timestamps:true
});

//hasing the password
userSchema.pre('save',async function(next) {
  if(!this.isModified("password")){
    return next();
  }

  this.password = await bcrypt.hash(this.password,12)
  next();
}) 

//compare password
userSchema.methods.comparePassword = async function(enterPassword){
  return await bcrypt.compare(enterPassword,this.password)
}

userSchema.methods.getResetPasswordToken = function(){
 const resetToken = crypto.randomBytes(20).toString('hex')
 this.resetPasswordToken = crypto
 .createHash('sha256')
 .update(resetToken)
 .digest('hex')
}


export const user = mongoose.model("User", userSchema);