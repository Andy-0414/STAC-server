import { Router } from "express";
import { GetEmotion } from "./api.v1.controller";

const router = Router();

// Routers
router.post("/emotion", GetEmotion);
export default router;
