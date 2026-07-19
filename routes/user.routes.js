import express from "express";
import { authenticationUser, createUserAccount, getcurrentUserProfile, signOutUser, updateUserProfile } from "../controllers/user.controller.js"
import { isAuthenticated } from "../proxy/auth.proxy.js"
import { validatesignUp } from "../proxy/validation.proxy.js";
  

const router = express.Router();

//Auth routes
router.post("/signup",createUserAccounth,validatesignUp);
router.post("/signin", authenticationUser);
router.post("/signout", signOutUser);

//Profile routes
router.get("/profile", isAuthenticated,getcurrentUserProfile);
router.patch("/profile", isAuthenticated,
    UploadStream.single("avatar"),
    updateUserProfile
);

export default router;

