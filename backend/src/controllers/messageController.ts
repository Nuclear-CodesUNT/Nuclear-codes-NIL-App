import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import Messages from '../models/Messages.js';
import User from '../models/User.js';

type AccountType = 'athlete' | 'coach' | 'lawyer';

function isValidObjectId(value: unknown): value is string {
    return typeof value === 'string' && Types.ObjectId.isValid(value);
}

function normalizeAccountType(role: unknown): AccountType | null {
    if (role === 'athlete' || role === 'coach' || role === 'lawyer') return role;
    return null;
}

/**
 * POST /api/messages/new-message
 * Body: { receiverId, message, conversationId? }
 * - Stores a new message
 * - Returns the message + conversationId
 */
export const createMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const senderId = req.session.userId;
        if (!senderId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { receiverId, message, conversationId } = req.body as {
            receiverId?: unknown;
            message?: unknown;
            conversationId?: unknown;
        };

        if (!isValidObjectId(String(receiverId ?? ''))) {
            return res.status(400).json({ message: 'Valid receiverId is required' });
        }

        const text = typeof message === 'string' ? message.trim() : '';
        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        // Allow creating a brand-new conversation thread even without a Conversation model.
        const convId = isValidObjectId(String(conversationId ?? ''))
            ? new Types.ObjectId(String(conversationId))
            : new Types.ObjectId();

        // Derive account_type from the logged-in user's role.
        const user = await User.findById(senderId).select('role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accountType = normalizeAccountType(user.role);
        if (!accountType) {
            return res.status(400).json({ message: 'Only athlete/coach/lawyer can send messages' });
        }

        const doc = await Messages.create({
            conversationId: convId,
            message: text,
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(String(receiverId)),
            account_type: accountType,
        });

        return res.status(201).json({
            conversationId: String(convId),
            message: doc,
        });
    } catch (error: unknown) {
        console.error('Error creating message:', error);
        return res.status(500).json({ message: 'Failed to create message' });
    }
};

/**
 * GET /api/messages/conversations
 * Returns conversation summaries sorted by most recent message.
 * This is what keeps the most recently active chat at the top.
 */
export const listConversations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const me = new Types.ObjectId(userId);

        const conversations = await Messages.aggregate([
            {
                $match: {
                    $or: [{ senderId: me }, { receiverId: me }],
                },
            },
            { $sort: { time: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                },
            },
            {
                $addFields: {
                    lastTime: '$lastMessage.time',
                    otherUserId: {
                        $cond: [
                            { $eq: ['$lastMessage.senderId', me] },
                            '$lastMessage.receiverId',
                            '$lastMessage.senderId',
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'otherUserId',
                    foreignField: '_id',
                    as: 'otherUser',
                    pipeline: [{ $project: { name: 1, role: 1 } }],
                },
            },
            { $unwind: { path: '$otherUser', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    conversationId: { $toString: '$_id' },
                    lastMessage: {
                        id: { $toString: '$lastMessage._id' },
                        message: '$lastMessage.message',
                        time: '$lastMessage.time',
                        senderId: { $toString: '$lastMessage.senderId' },
                        receiverId: { $toString: '$lastMessage.receiverId' },
                    },
                    otherUser: {
                        id: { $toString: '$otherUser._id' },
                        name: '$otherUser.name',
                        role: '$otherUser.role',
                    },
                    lastTime: 1,
                },
            },
            { $sort: { lastTime: -1 } },
        ]);

        return res.status(200).json({ conversations });
    } catch (error: unknown) {
        console.error('Error listing conversations:', error);
        return res.status(500).json({ message: 'Failed to list conversations' });
    }
};

/**
 * GET /api/messages/conversations/:conversationId
 * Returns messages in a conversation, oldest -> newest.
 */
export const getConversationMessages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { conversationId } = req.params as { conversationId?: string };
        if (!isValidObjectId(conversationId)) {
            return res.status(400).json({ message: 'Invalid conversationId' });
        }

        const me = new Types.ObjectId(userId);
        const conv = new Types.ObjectId(conversationId);

        const messages = await Messages.find({
            conversationId: conv,
            $or: [{ senderId: me }, { receiverId: me }],
        })
            .sort({ time: 1 })
            .lean();

        return res.status(200).json({
            conversationId,
            messages,
        });
    } catch (error: unknown) {
        console.error('Error fetching conversation messages:', error);
        return res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

/**
 * GET /api/messages/users/search?q=name
 * Searches for users by name to start a new conversation.
 */
export const searchUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(200).json({ users: [] });
        }

        const userId = req.session.userId;

        // Search for users matching the query, excluding the person currently logged in
        const users = await User.find({
            name: { $regex: q, $options: 'i' },
            ...(userId ? { _id: { $ne: new Types.ObjectId(userId) } } : {})
        })
        .select('name role')
        .limit(10); // Keep it to the top 10 results

        return res.status(200).json({ users });
    } catch (error: unknown) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Failed to search users' });
    }
};