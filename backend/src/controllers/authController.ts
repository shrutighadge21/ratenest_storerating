import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedAddress = (address || '').trim();

    if (trimmedName.length < 20 || trimmedName.length > 60) {
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (trimmedAddress.length > 400) {
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    }

    if (
      password.length < 8 ||
      password.length > 16 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return res.status(400).json({
        message: 'Password must be 8–16 characters with at least 1 uppercase and 1 special character',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Public registration is ALWAYS NORMAL_USER
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        address: trimmedAddress,
        role: 'NORMAL_USER',
      },
    });

    const token = generateToken(user.id, user.role);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) {
      return res.status(401).json({ message: 'Email or password doesn’t match. Please try again.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password doesn’t match. Please try again.' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16 ||
      !/[A-Z]/.test(newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    ) {
      return res.status(400).json({
        message: 'New password must be 8–16 characters with at least 1 uppercase and 1 special character',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, address } = req.body;
    
    if (!name || name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    }
    if (address && address.trim().length > 400) {
      return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        address: address ? address.trim() : undefined,
      },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
