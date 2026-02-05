import express from "express";


const router = express.Router();

router.post("/signup");
router.post("/login");
router.post("/logout");


router.put("/update-profile");


export default router;