import { Router } from "express";
const router = Router();

// 여기에다 라우터 추가
import Auth from "./auth/auth.router";
import Admin from "./admin/admin.router";
import Post from "./post/post.router";
import Api from "./api/api.v1.router";

router.use("/admin", Admin);
router.use("/auth", Auth);
router.use("/post", Post);
router.use("/api/v1", Api);

export default router;
