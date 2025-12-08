import { Router } from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:userId", deleteUser);

export default router;
