import { asyncHandler } from "../utils/asyncHandler.js";
import {APIError} from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
const generateRefreshAndAccessToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken  = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
     await user.save({validateBeforeSave:false})

     return {accessToken, refreshToken}
   } catch (error) {
      throw new APIError(500, "Something went wrong while generating refresh and access token")
   }
}
const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   // validation -not empty
   // check if user already exists: username ,email
   // check for images, check for avatar
   // upload them to cloudinary, avatar 
   // create user object -create entry in db
   // remove password and refresh token field from response
   // check for user creation 
   //return res


  const {fullname, email, username, password}= req.body
   console.log("email:", email);
   if([fullname, email, username, password].some((field) =>
   field?.trim() === "")){
    throw new APIError(400, "All fields are required")
   }
  const existedUser=await User.findOne({
    $or: [{username}, {email}]
   })
   if(existedUser){
    throw new APIError(409, "User with email or username already exist")
   }
   //console.log(req.files);
   let avatarLocalPath;
   if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
       avatarLocalPath = req.files.avatar[0].path
   }
   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }
 
 const avatar = await  uploadOnCloudinary(avatarLocalPath)
 const coverImage = await  uploadOnCloudinary(coverImageLocalPath)
 
 const user = await User.create({
    fullname,
    avatar:avatar?.url || "",
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
 })
 const createdUser = await User.findById(user._id).select(
    "-password -rereshToken"
 )
 if(!createdUser){
    throw new APIError(500, "something went wrong while registring the user")
 }
 return res.status(201).json(
    new APIResponse(200, createdUser, "User registered Successfully")
 )
})

const loginUser = asyncHandler(async (req, res) => {
   // req body -> data
   // username or email
   // find the user
   //password check
   //access and refresh token
   // send cookie
   
   
   const {email, username, password} = req.body
   console.log(email);
 if(!username && !email) 
   {
      throw new APIError(400, "Username or password is required")
   }
 const user = await User.findOne({
   $or: [{username}, {email}]

  })
if(!user){
   throw new APIError(400, " user does not exist")
}

const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
   throw new APIError(401, "password incorrect ")
}
const {accessToken, refreshToken}= await
 generateRefreshAndAccessToken(user._id)

 const loggedInUser = await User.findById(user._id).
 select("-password -refreshToken")
const options ={
    httpOnly:true,
    secure:true

}
return res.status(200).cookie("accessToken", accessToken, options)
                      .cookie("refreshToken", refreshToken, options)
                      .json(

                        new APIResponse(
                           200,{
                               user:loggedInUser, accessToken,
                               refreshToken
                           },
                           "User logged In Successfully"
                        )
                      )

})

const logoutUser = asyncHandler(async(req, res) => {
await User.findByIdAndUpdate(
   req.user._id,
   {
      $set:{
         refreshToken:undefined
      }
   },
   {
      new:true
   }
 )
const options = {
   httpOnly:true,
   secure:true
}

return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new APIResponse(200, {}, "User Logged Out"))

})
export {registerUser,loginUser ,logoutUser}