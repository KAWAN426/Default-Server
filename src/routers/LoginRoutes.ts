import { loginUserGoogle } from "@/controllers/loginController";
import { validateAndBody } from "@/middleware/validateBody";
import { verifyToken } from "@/middleware/verifyToken";
import { Router } from "express";

const router = Router();

/*
 * 구글 로그인용 사용자 생성
 * verifyToken 참조
 */
router.post("/google", verifyToken(), loginUserGoogle);

export default router;
