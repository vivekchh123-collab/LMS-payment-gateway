import jwt from "jsonwebtoken";

export const genrateToken = (res,user,message) => {
    const token = jwt.sign({ userId: user._if }, process.env.SECRET_KEY,
        {expiresIn:"id"}
    );

    return res
    .status(200)
    .cookie("token",token,{
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24* 60 * 60 * 1000, //1 day
    })
    .json({
        success: true,
        message,
        user,
        token,
    });
}