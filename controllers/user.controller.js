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

export const updateUserProfile = catchAsync(async (req, res) => {
  const { name,email, bio } = req.body;

  const updateData = {
    name,
    email:email?.toLowerCase(),
    bio
  };
  if(req.file){
    const avatarResult = await uploadMedia(req.file.path)
    updateData.avatar = avatarResult.secure_url

    //delete old avatar
    const user = await User.findById(req.id)
    if(user.avatar && user.avatar !== 'default-avatar.png'){
        await deleteMediaFromCloudinary(user.avatar)
    }
  }
//update user and get updated doc

const updateUser = await User.findByIdAndUpdate(
    req.id,
    updateData,
    {new : true,runValidators: true}
)
if(!updateUser){
    throw new ApiError("User not found",404);
}

res.status(200).json(
    {
        success: true,
        message:"Profile update successfully",
        data: updatedUser,
    }
)


});

