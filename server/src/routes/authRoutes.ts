import { Router } from "express";
import {
  signin,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/authController";

const router = Router();

router.post("/signin", signin);
router.post("/create", createAdmin);
router.get("/admins", getAllAdmins);
router.delete("/admins/:adminId", deleteAdmin);

export default router;
