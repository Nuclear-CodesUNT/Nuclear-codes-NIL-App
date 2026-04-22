import type { Server as HttpServer } from 'http';

import { Server } from 'socket.io';
import { Types } from 'mongoose';

import Messages from './models/Messages.js';
import User from './models/User.js';

type AccountType = 'athlete' | 'coach' | 'lawyer';

type SessionLike = {
    userId?: string;
};

type SocketRequest = {
    session?: SessionLike;
};

function normalizeAccountType(role: unknown): AccountType | null {
    if (role === 'athlete' || role === 'coach' || role === 'lawyer') return role;
    return null;
}

function isValidObjectId(value: unknown): value is string {
    return typeof value === 'string' && Types.ObjectId.isValid(value);
}

function convRoom(conversationId: string) {
    return `conv:${conversationId}`;
}

function userRoom(userId: string) {
    return `user:${userId}`;
}

export function setupSocket(httpServer: HttpServer, sessionMiddleware: any) {
    const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

    const io = new Server(httpServer, {
        cors: {
            origin: ORIGIN,
            credentials: true,
        },
    });

    // Share express-session with Socket.IO
    io.use((socket, next) => {
        try {
            const resStub = {
                getHeader() {
                    return undefined;
                },
                setHeader() {
                    // noop
                },
                on() {
                    // noop
                },
                once() {
                    // noop
                },
                end() {
                    // noop
                },
            };

            sessionMiddleware(socket.request as any, (socket.request as any).res ?? (resStub as any), next as any);
        } catch (err) {
            next(err as any);
        }
    });

    io.on('connection', (socket) => {
        const req = socket.request as unknown as SocketRequest;
        const userId = req.session?.userId;

        if (userId) {
            socket.join(userRoom(userId));
        }

        socket.on('join_conversation', (payload: { conversationId?: string }) => {
            const conversationId = payload?.conversationId;
            if (!conversationId) return;
            socket.join(convRoom(conversationId));
        });

        socket.on('leave_conversation', (payload: { conversationId?: string }) => {
            const conversationId = payload?.conversationId;
            if (!conversationId) return;
            socket.leave(convRoom(conversationId));
        });

        socket.on(
            'typing',
            (payload: { conversationId?: string; isTyping?: boolean }) => {
                if (!userId) return;
                const conversationId = payload?.conversationId;
                if (!conversationId) return;
                socket.to(convRoom(conversationId)).emit('typing', {
                    conversationId,
                    userId,
                    isTyping: !!payload?.isTyping,
                });
            },
        );

        socket.on(
            'send_message',
            async (
                payload: { receiverId?: string; message?: string; conversationId?: string },
                ack?: (data: any) => void,
            ) => {
                try {
                    if (!userId) {
                        ack?.({ ok: false, error: 'Not authenticated' });
                        return;
                    }

                    const receiverId = payload?.receiverId;
                    const text = typeof payload?.message === 'string' ? payload.message.trim() : '';

                    if (!isValidObjectId(receiverId)) {
                        ack?.({ ok: false, error: 'Valid receiverId is required' });
                        return;
                    }

                    if (!text) {
                        ack?.({ ok: false, error: 'Message text is required' });
                        return;
                    }

                    const conversationId = isValidObjectId(payload?.conversationId)
                        ? String(payload.conversationId)
                        : String(new Types.ObjectId());

                    const sender = await User.findById(userId).select('role');
                    if (!sender) {
                        ack?.({ ok: false, error: 'User not found' });
                        return;
                    }

                    const accountType = normalizeAccountType(sender.role);
                    if (!accountType) {
                        ack?.({ ok: false, error: 'Only athlete/coach/lawyer can send messages' });
                        return;
                    }

                    const doc = await Messages.create({
                        conversationId: new Types.ObjectId(conversationId),
                        message: text,
                        senderId: new Types.ObjectId(userId),
                        receiverId: new Types.ObjectId(receiverId),
                        account_type: accountType,
                    });

                    const eventPayload = {
                        conversationId,
                        message: {
                            id: String(doc._id),
                            message: doc.message,
                            time: doc.time,
                            senderId: String(doc.senderId),
                            receiverId: String(doc.receiverId),
                        },
                    };

                    // Broadcast to all clients in the conversation + also direct to receiver.
                    io.to(convRoom(conversationId)).emit('message:new', eventPayload);
                    io.to(userRoom(receiverId)).emit('message:new', eventPayload);

                    ack?.({ ok: true, ...eventPayload });
                } catch (error: unknown) {
                    console.error('Socket send_message error:', error);
                    ack?.({ ok: false, error: 'Failed to send message' });
                }
            },
        );
    });

    return io;
}
