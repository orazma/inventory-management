import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Simple password comparison (in production, use bcrypt)
    if (admin.password !== password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.json({
      success: true,
      admin: {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing in" });
  }
};

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adminId, name, email, password, role } = req.body;

    if (!adminId || !name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      res.status(400).json({ message: "Admin with this email already exists" });
      return;
    }

    const newAdmin = await prisma.admin.create({
      data: {
        adminId,
        name,
        email,
        password, // In production, hash this with bcrypt
        role: role || "MODERATOR",
      },
    });

    res.status(201).json({
      success: true,
      admin: {
        adminId: newAdmin.adminId,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        adminId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving admins" });
  }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adminId } = req.params;

    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    // Prevent deleting the only super admin
    const superAdminCount = await prisma.admin.count({
      where: { role: "SUPER_ADMIN" },
    });

    if (admin.role === "SUPER_ADMIN" && superAdminCount === 1) {
      res.status(400).json({ message: "Cannot delete the only super admin" });
      return;
    }

    await prisma.admin.delete({
      where: { adminId },
    });

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};
