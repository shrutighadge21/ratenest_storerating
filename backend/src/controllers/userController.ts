import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    const avgAggregate = await prisma.rating.aggregate({
      _avg: { score: true },
    });

    const averageRating = avgAggregate._avg.score
      ? Number(avgAggregate._avg.score.toFixed(2))
      : 0;

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics', error });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, name, email, address, role, sort } = req.query;

    const where: any = {};

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { address: { contains: q } },
      ];
    } else {
      if (name) where.name = { contains: String(name) };
      if (email) where.email = { contains: String(email) };
      if (address) where.address = { contains: String(address) };
    }

    if (role && role !== 'ALL') {
      where.role = String(role);
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: {
          include: {
            ratings: true,
          },
        },
      },
    });

    // Compute store owner stats if applicable
    const formattedUsers = users.map((u) => {
      let storeDetails = undefined;
      if (u.store) {
        const storeRatings = u.store.ratings;
        const total = storeRatings.length;
        const sum = storeRatings.reduce((acc, r) => acc + r.score, 0);
        const avg = total > 0 ? Number((sum / total).toFixed(2)) : 0;

        storeDetails = {
          id: u.store.id,
          name: u.store.name,
          email: u.store.email,
          address: u.store.address,
          averageRating: avg,
          totalRatings: total,
          ratings: storeRatings,
        };
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        store: storeDetails,
      };
    });

    // Sorting
    const sortField = String(sort || 'name_asc');
    formattedUsers.sort((a, b) => {
      if (sortField === 'name_desc') return b.name.localeCompare(a.name);
      if (sortField === 'email_asc') return a.email.localeCompare(b.email);
      if (sortField === 'email_desc') return b.email.localeCompare(a.email);
      if (sortField === 'role_asc') return a.role.localeCompare(b.role);
      if (sortField === 'role_desc') return b.role.localeCompare(a.role);
      if (sortField === 'address_asc') return (a.address || '').localeCompare(b.address || '');
      if (sortField === 'address_desc') return (b.address || '').localeCompare(a.address || '');
      return a.name.localeCompare(b.name);
    });

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, address, role } = req.body;

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

    const validRoles = ['NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN'];
    const assignedRole = validRoles.includes(role) ? role : 'NORMAL_USER';

    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        address: trimmedAddress,
        role: assignedRole,
      },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.rating.deleteMany({ where: { userId: id } });
    await prisma.store.deleteMany({ where: { ownerId: id } });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
