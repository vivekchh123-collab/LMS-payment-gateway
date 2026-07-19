import { ApiError, catchAsync } from "../proxy/error.proxy";
import { user, User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const createUserAccount = catchAsync(async(req,res) => {
    const {
        name,email,password,role = 'student'
    } = req.body

   const existingUser = await  User.findOne({email:email.toLowerCase()})

    if(existingUser){
        throw new ApiError('User already exists',400);
    }

   const user = await User.create({
        name,
        email:email.toLowerCase(),
        password,
        role
    })

    await user.updateLastActive();
    generateToken(res,user,'Account created Successfully');

})

export const authenticationUser = catchAsync(async (req,res) => {
    const {email,password} = req.body

    User.findOne ({
        email: email.toLowerCase()
    }).select('+password')

    if(!user || ! (await user.comparePassword(password))){
        throw new ApiErro("Invalid email or password")
    }

    await user.updateLastActive();
    generateToken(res,user,`Welcome back ${user.name}`)
});

export const signOutUser = catchAsync(async (req, res) => {
  res.cookie('token','',{maxAge:0})

res.status(200).json({
    success: true,
    message:"Sgned out successfully"
})
});

export const getcurrentUserProfile = catchAsync(async (req, res) => {
    const user = User.findById(req.id).populate({
        path: 'enrolledCourse.course',
        select: 'title thumbnail decscription'
    });
    if(!user){
        throw new ApiError("User not found",401);
    }

res.status(200).json({
    success: true,
    data: {
        ...user.toJSON(),
        totalEnrolledCourses: user.totalEnrolledCourses,

    },
    message:"Sgned out successfully"
})    
});