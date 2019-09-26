import { Router } from "express";
import { GetEmotion, GetEmotionCount } from "./api.v1.controller";
import PassportJWTAuth from "../../modules/PassportJWT-Auth";

const router = Router();

// Routers
router.post("/emotion", PassportJWTAuth.authenticate(), GetEmotion);
router.post("/emotionCount", PassportJWTAuth.authenticate(), GetEmotionCount);

export default router;
