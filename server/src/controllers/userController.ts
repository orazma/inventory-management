import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
      res.status(400).json({ message: "User ID, name, and email are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { userId },
    });

    if (existingUser) {
      res.status(400).json({ message: "User with this ID already exists" });
      return;
    }

    const newUser = await prisma.users.create({
      data: {
        userId,
        name,
        email,
      },
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.users.delete({
      where: { userId },
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
