import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const getAllUsersHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error: unknown) {
    console.error('Failed to fetch users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  
};

export const getUserHandler = async(req: Request, res: Response): Promise<Response> => {
    try{
        const id = req.params.id;
        
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ message: 'Valid User ID is required' });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "user not found"});
        }
        
        return res.status(200).json({ user })
        
    } catch(error: unknown) {
        console.error('Failed to fetch user by id:', error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const deleteUserHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid User ID is required' });
    }

    const deleted = await userService.deleteUserById(id);

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (error: unknown) {
    console.error('Failed to delete user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const banUserHandler = async (req: Request, res: Response) => {
 const id = (req.params.id as string);
  const { reason } = req.body;

  try {
    const success = await userService.banUserById(id, reason);
    if (!success) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User banned successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const unbanUserHandler = async (req: Request, res: Response) => {
  const id = (req.params.id as string);

  try {
    const success = await userService.unbanUserById(id);
    if (!success) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User unbanned successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};