import { Elysia } from 'elysia';

export const roleMiddleware = (allowedRoles: string[]) => {
  return ({ userRole, set }: any) => {
    if (!userRole || !allowedRoles.includes(userRole)) {
      set.status = 403;
      throw new Error('Insufficient permissions');
    }
  };
};