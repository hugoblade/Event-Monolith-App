import { prisma } from '../prisma/client';
import { jwtUtils } from '../utils/jwt.utils';
import bcrypt from 'bcryptjs';

export const authController = {
  async register({ email, password, name }: { email: string; password: string; name: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name,
        role: 'ATTENDEE'
      },
      select: { id: true, email: true, name: true, role: true }
    });

    const token = jwtUtils.generateToken(user.id, user.role);
    
    return { 
      success: true,
      message: 'User registered successfully',
      data: { user, token } 
    };
  },

  async login({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwtUtils.generateToken(user.id, user.role);
    
    return {
      success: true,
      message: 'Login successful',
      data: { 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        }, 
        token 
      }
    };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: user
    };
  }
};