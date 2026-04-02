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
