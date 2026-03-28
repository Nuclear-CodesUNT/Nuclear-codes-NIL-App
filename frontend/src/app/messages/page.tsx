"use client";

import * as React from "react";
import { io, type Socket } from "socket.io-client";
import {
    Clock,
    Home,
    MoreVertical,
    Paperclip,
    Pin,
    Search,
    Send,
    Shield,
    Smile,
    Users,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";

type ConversationCategory = "all" | "coaches" | "players" | "history";

type Message = {
    id: string;
    fromSelf: boolean;
    text: string;
    time: string;
    senderInitials: string;
};

type ConversationPeer = {
    id: string;
    name: string;
    role?: string;
};

type Conversation = {
    id: string;
    displayName: string;
    subtitle: string;
    time: string;
    unreadCount?: number;
    pinned: boolean;
    kind: "coach" | "player";
    isHistory?: boolean;
    avatarInitials: string;
    messages: Message[];
    peer?: ConversationPeer;
};

type ApiConversation = {
    conversationId: string;
    lastMessage?: {
        id: string;
        message: string;
        time: string;
        senderId: string;
        receiverId: string;
    };
    otherUser?: {
        id: string;
        name: string;
        role?: string;
    };
};

type ApiMessage = {
    _id?: string;
    id?: string;
    message: string;
    time: string;
    senderId: unknown;
    receiverId: unknown;
};

type SocketMessageNewPayload = {
    conversationId: string;
    message: {
        id: string;
        message: string;
        time: string;
        senderId: string;
        receiverId: string;
    };
};

const EMOJIS = ["😀", "😄", "😊", "😂", "👍", "🔥", "🎉", "❤️"];

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "?";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function formatTimeLabel(value: string | Date) {
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

let socketSingleton: Socket | null = null;
function getSocket() {
    if (socketSingleton) return socketSingleton;
    const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
    socketSingleton = io(base, {
        withCredentials: true,
        transports: ["websocket"],
    });
    return socketSingleton;
}

export default function MessagesPage() {
    const [activeCategory, setActiveCategory] = React.useState<ConversationCategory>("all");
    const [search, setSearch] = React.useState<string>("");
    const [selectedConversationId, setSelectedConversationId] = React.useState<string>("");
    const [composer, setComposer] = React.useState<string>("");
    const [emojiOpen, setEmojiOpen] = React.useState<boolean>(false);
    const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);
    const [meId, setMeId] = React.useState<string | null>(null);
    const [typingByConversation, setTypingByConversation] = React.useState<Record<string, boolean>>({});

    const typingTimeoutRef = React.useRef<number | null>(null);
    const joinedConversationRef = React.useRef<string | null>(null);

    const [conversations, setConversations] = React.useState<Conversation[]>([]);

    const fetchConversations = React.useCallback(async () => {
        const { data } = await api.get("/messages/conversations");
        const list = (data?.conversations ?? []) as ApiConversation[];
        if (!Array.isArray(list)) return [];

        const mapped: Conversation[] = list.map((c) => {
            const otherName = c.otherUser?.name || "Unknown";
            const role = c.otherUser?.role;
            const kind: "coach" | "player" = role === "coach" ? "coach" : "player";

            return {
                id: c.conversationId,
                displayName: otherName,
                subtitle: c.lastMessage?.message?.slice(0, 18) || "",
                time: c.lastMessage?.time ? formatTimeLabel(c.lastMessage.time) : "",
                pinned: false,
                kind,
                avatarInitials: initialsFromName(otherName),
                messages: [],
                peer: c.otherUser ? { id: c.otherUser.id, name: otherName, role: c.otherUser.role } : undefined,
            };
        });

        setConversations((prev) => {
            if (prev.length === 0) return mapped;

            const prevById = new Map(prev.map((c) => [c.id, c] as const));
            return mapped.map((c) => {
                const existing = prevById.get(c.id);
                if (!existing) return c;
                return {
                    ...c,
                    pinned: existing.pinned,
                    unreadCount: existing.unreadCount,
                    isHistory: existing.isHistory,
                    messages: existing.messages?.length ? existing.messages : c.messages,
                };
            });
        });

        setSelectedConversationId((prev) => prev || mapped[0]?.id || "");
        return mapped;
    }, []);

    // Load current user + existing conversations from backend
    React.useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const me = await api.get("/auth/me");
                const id = String(me.data?._id ?? me.data?.id ?? "");
                if (!cancelled && id) setMeId(id);
            } catch {
                // keep null
            }

            try {
                if (!cancelled) await fetchConversations();
            } catch {
                // leave empty
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [fetchConversations]);

    const selectedConversation = React.useMemo(
        () => conversations.find((c) => c.id === selectedConversationId) ?? conversations[0],
        [conversations, selectedConversationId],
    );

    // Load messages for selected conversation (REST)
    React.useEffect(() => {
        let cancelled = false;
        const loadMessages = async () => {
            const convId = selectedConversation?.id;
            if (!convId) return;
            if (!/^[a-f\d]{24}$/i.test(convId)) return;

            try {
                const { data } = await api.get(`/messages/conversations/${convId}`);
                const rows = (data?.messages ?? []) as ApiMessage[];
                if (cancelled || !Array.isArray(rows)) return;

                setConversations((prev) =>
                    prev.map((c) => {
                        if (c.id !== convId) return c;
                        const mapped = rows.map((m) => {
                            const senderId = m.senderId == null ? "" : String(m.senderId);
                            const fromSelf = meId
                                ? senderId === meId
                                : (c.peer?.id ? senderId !== c.peer.id : false);
                            const initials = fromSelf ? "YO" : initialsFromName(c.displayName);
                            return {
                                id: String(m._id ?? m.id ?? Math.random()),
                                fromSelf,
                                text: m.message,
                                time: formatTimeLabel(m.time),
                                senderInitials: initials,
                            };
                        });
                        return { ...c, messages: mapped };
                    }),
                );
            } catch {
                // ignore
            }
        };

        loadMessages();
        return () => {
            cancelled = true;
        };
    }, [meId, selectedConversation?.id]);

    // Socket.IO: connect, join rooms, and receive messages/typing
    React.useEffect(() => {
        const socket = getSocket();

        const onMessageNew = (payload: SocketMessageNewPayload) => {
            if (!payload?.conversationId || !payload?.message) return;

            setConversations((prev) => {
                const exists = prev.some((c) => c.id === payload.conversationId);
                const timeLabel = formatTimeLabel(payload.message.time);

                const applyTo = (list: Conversation[]) => {
                    const next = list.map((c) => {
                        if (c.id !== payload.conversationId) return c;
                        const fromSelf = meId
                            ? payload.message.senderId === meId
                            : (c.peer?.id ? payload.message.senderId !== c.peer.id : false);
                        const msg: Message = {
                            id: payload.message.id,
                            fromSelf,
                            text: payload.message.message,
                            time: timeLabel,
                            senderInitials: fromSelf ? "YO" : initialsFromName(c.displayName),
                        };
                        const messages = [...(c.messages ?? []), msg];
                        return {
                            ...c,
                            subtitle: payload.message.message.slice(0, 18),
                            time: timeLabel,
                            messages,
                        };
                    });

                    // Move updated conversation to the top of its pin-group
                    const idx = next.findIndex((c) => c.id === payload.conversationId);
                    if (idx <= 0) return next;

                    const updated = next[idx];
                    const rest = next.filter((c) => c.id !== payload.conversationId);

                    if (updated.pinned) {
                        const pinnedFirst = [updated, ...rest.filter((c) => c.pinned)];
                        const unpinnedRest = rest.filter((c) => !c.pinned);
                        return [...pinnedFirst, ...unpinnedRest];
                    }

                    const pinnedGroup = rest.filter((c) => c.pinned);
                    const unpinnedGroup = rest.filter((c) => !c.pinned);
                    return [...pinnedGroup, updated, ...unpinnedGroup];
                };

                if (exists) return applyTo(prev);

                // New conversation (not in list yet) -> refresh from API so it shows up.
                // Keep existing UI stable while the refresh runs.
                fetchConversations().catch(() => {
                    // ignore
                });
                return prev;
            });
        };

        const onTyping = (payload: { conversationId: string; userId: string; isTyping: boolean }) => {
            if (!payload?.conversationId) return;
            if (meId && payload.userId === meId) return;
            setTypingByConversation((prev) => ({
                ...prev,
                [payload.conversationId]: !!payload.isTyping,
            }));
        };

        socket.on("message:new", onMessageNew);
        socket.on("typing", onTyping);

        return () => {
            socket.off("message:new", onMessageNew);
            socket.off("typing", onTyping);
        };
    }, [fetchConversations, meId]);

    React.useEffect(() => {
        const socket = getSocket();
        const convId = selectedConversationId;

        if (joinedConversationRef.current && joinedConversationRef.current !== convId) {
            socket.emit("leave_conversation", { conversationId: joinedConversationRef.current });
            joinedConversationRef.current = null;
        }

        if (convId && /^[a-f\d]{24}$/i.test(convId)) {
            socket.emit("join_conversation", { conversationId: convId });
            joinedConversationRef.current = convId;
        }

        return () => {
            if (convId && /^[a-f\d]{24}$/i.test(convId)) socket.emit("leave_conversation", { conversationId: convId });
        };
    }, [selectedConversationId]);

    React.useEffect(() => {
        if (!conversations.some((c) => c.id === selectedConversationId)) {
            setSelectedConversationId(conversations[0]?.id ?? "");
        }
    }, [conversations, selectedConversationId]);

    const pinned = React.useMemo(
        () => conversations.filter((c) => c.pinned),
        [conversations],
    );

    const unpinned = React.useMemo(
        () => conversations.filter((c) => !c.pinned),
        [conversations],
    );

    const visibleConversations = React.useMemo(() => {
        const q = search.trim().toLowerCase();

        const base = (list: Conversation[]) =>
            list.filter((c) => {
                const matchesCategory =
                    activeCategory === "all" ||
                    (activeCategory === "coaches" && c.kind === "coach") ||
                    (activeCategory === "players" && c.kind === "player") ||
                    (activeCategory === "history" && !!c.isHistory);

                if (!matchesCategory) return false;

                if (!q) return true;
                return (
                    c.displayName.toLowerCase().includes(q) ||
                    c.subtitle.toLowerCase().includes(q)
                );
            });

        return { pinned: base(pinned), unpinned: base(unpinned) };
    }, [activeCategory, pinned, search, unpinned]);

    function togglePin(conversationId: string) {
        setConversations((prev) =>
            prev.map((c) => (c.id === conversationId ? { ...c, pinned: !c.pinned } : c)),
        );
    }

    function handlePickEmoji(emoji: string) {
        setComposer((prev) => prev + emoji);
        setEmojiOpen(false);
    }

    function sendMessage() {
        const text = composer.trim();
        if (!text) return;

        const convId = selectedConversationId;
        const peerId = selectedConversation?.peer?.id;
        if (!convId || !/^[a-f\d]{24}$/i.test(convId)) return;
        if (!peerId || !/^[a-f\d]{24}$/i.test(peerId)) return;

        const socket = getSocket();
        const useSocket = socket.connected;

        // Emit typing off immediately
        if (convId) {
            socket.emit("typing", { conversationId: convId, isTyping: false });
            setTypingByConversation((prev) => ({ ...prev, [convId]: false }));
        }

        if (useSocket) {
            socket.emit(
                "send_message",
                { conversationId: convId, receiverId: peerId, message: text },
                async (ack?: { ok?: boolean; error?: string }) => {
                    if (ack?.ok) return;
                    // Fallback to REST if socket send fails
                    try {
                        const { data } = await api.post("/messages/new-message", {
                            conversationId: convId,
                            receiverId: peerId,
                            message: text,
                        });

                        const msg = data?.message as ApiMessage | undefined;
                        if (!msg?.message || !msg?.time) return;
                        const timeLabel = formatTimeLabel(msg.time);

                        setConversations((prev) => {
                            const next = prev.map((c) => {
                                if (c.id !== convId) return c;
                                const fromSelf = true;
                                const m: Message = {
                                    id: String(msg._id ?? msg.id ?? Date.now()),
                                    fromSelf,
                                    text: msg.message,
                                    time: timeLabel,
                                    senderInitials: "YO",
                                };
                                return {
                                    ...c,
                                    subtitle: msg.message.slice(0, 18),
                                    time: timeLabel,
                                    messages: [...(c.messages ?? []), m],
                                };
                            });

                            // Move updated conversation to the top of its pin-group
                            const idx = next.findIndex((c) => c.id === convId);
                            if (idx <= 0) return next;

                            const updated = next[idx];
                            const rest = next.filter((c) => c.id !== convId);

                            if (updated.pinned) {
                                const pinnedFirst = [updated, ...rest.filter((c) => c.pinned)];
                                const unpinnedRest = rest.filter((c) => !c.pinned);
                                return [...pinnedFirst, ...unpinnedRest];
                            }

                            const pinnedGroup = rest.filter((c) => c.pinned);
                            const unpinnedGroup = rest.filter((c) => !c.pinned);
                            return [...pinnedGroup, updated, ...unpinnedGroup];
                        });
                    } catch {
                        // ignore
                    }
                },
            );
        } else {
            api
                .post("/messages/new-message", {
                    conversationId: convId,
                    receiverId: peerId,
                    message: text,
                })
                .then(({ data }) => {
                    const msg = data?.message as ApiMessage | undefined;
                    if (!msg?.message || !msg?.time) return;
                    const timeLabel = formatTimeLabel(msg.time);

                    setConversations((prev) => {
                        const next = prev.map((c) => {
                            if (c.id !== convId) return c;
                            const m: Message = {
                                id: String(msg._id ?? msg.id ?? Date.now()),
                                fromSelf: true,
                                text: msg.message,
                                time: timeLabel,
                                senderInitials: "YO",
                            };
                            return {
                                ...c,
                                subtitle: msg.message.slice(0, 18),
                                time: timeLabel,
                                messages: [...(c.messages ?? []), m],
                            };
                        });

                        const idx = next.findIndex((c) => c.id === convId);
                        if (idx <= 0) return next;

                        const updated = next[idx];
                        const rest = next.filter((c) => c.id !== convId);

                        if (updated.pinned) {
                            const pinnedFirst = [updated, ...rest.filter((c) => c.pinned)];
                            const unpinnedRest = rest.filter((c) => !c.pinned);
                            return [...pinnedFirst, ...unpinnedRest];
                        }

                        const pinnedGroup = rest.filter((c) => c.pinned);
                        const unpinnedGroup = rest.filter((c) => !c.pinned);
                        return [...pinnedGroup, updated, ...unpinnedGroup];
                    });
                })
                .catch(() => {
                    // ignore
                });
        }

        setComposer("");
        setSelectedMessageId(null);
    }

    // Typing indicator: debounce typing events
    React.useEffect(() => {
        const socket = getSocket();
        const convId = selectedConversationId;
        if (!convId) return;

        if (!/^[a-f\d]{24}$/i.test(convId)) return;

        // Only emit typing for real conversations (ObjectId) where we have a peer
        if (!selectedConversation?.peer?.id) return;
        if (!/^[a-f\d]{24}$/i.test(selectedConversation.peer.id)) return;

        const isTypingNow = composer.trim().length > 0;
        socket.emit("typing", { conversationId: convId, isTyping: isTypingNow });

        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            socket.emit("typing", { conversationId: convId, isTyping: false });
        }, 900);

        return () => {
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        };
    }, [composer, selectedConversation?.peer?.id, selectedConversationId]);

    function ConversationRow({ conversation }: { conversation: Conversation }) {
        const active = conversation.id === selectedConversationId;
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    setSelectedConversationId(conversation.id);
                    setEmojiOpen(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedConversationId(conversation.id);
                        setEmojiOpen(false);
                    }
                }}
                className={cx(
                    "w-full text-left rounded-xl px-3 py-3 transition-colors outline-none",
                    active ? "bg-blue-50" : "hover:bg-gray-50",
                    "focus-visible:ring-2 focus-visible:ring-blue-200",
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">
                        {conversation.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-medium text-gray-900">{conversation.displayName}</p>
                                    <button
                                        type="button"
                                        className={cx(
                                            "inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:text-gray-600",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            togglePin(conversation.id);
                                        }}
                                        aria-label={conversation.pinned ? "Unpin" : "Pin"}
                                    >
                                        <Pin className={cx("h-4 w-4", conversation.pinned ? "text-blue-600" : "")} />
                                    </button>
                                </div>
                                <p className="truncate text-sm text-gray-500">{conversation.subtitle}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xs text-gray-400">{conversation.time}</span>
                                {!!conversation.unreadCount && conversation.unreadCount > 0 ? (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-medium text-white">
                                        {conversation.unreadCount}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-screen max-w-350">
                {/* Left: conversations */}
                <aside className="w-90 border-r border-gray-200">
                    <div className="px-6 pt-6">
                        <h1 className="text-lg font-medium text-gray-900">Messages</h1>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversation..."
                                className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveCategory("all")}
                                className={cx(
                                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                                    activeCategory === "all"
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                                )}
                            >
                                <Users className="h-4 w-4" />
                                All
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory("coaches")}
                                className={cx(
                                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                                    activeCategory === "coaches"
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                                )}
                            >
                                <Shield className="h-4 w-4" />
                                Coaches
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory("players")}
                                className={cx(
                                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                                    activeCategory === "players"
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                                )}
                            >
                                <Users className="h-4 w-4" />
                                Players
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory("history")}
                                className={cx(
                                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                                    activeCategory === "history"
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                                )}
                            >
                                <Clock className="h-4 w-4" />
                                History
                            </button>
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-172px)] px-3 pb-6 pt-4">
                        {visibleConversations.pinned.length > 0 ? (
                            <div className="px-3">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400">PINNED</p>
                            </div>
                        ) : null}

                        <div className="space-y-1 px-3">
                            {visibleConversations.pinned.map((conversation) => (
                                <ConversationRow key={conversation.id} conversation={conversation} />
                            ))}
                        </div>

                        <div className="mt-6 px-3">
                            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400">ALL CONVERSATIONS</p>
                        </div>

                        <div className="space-y-1 px-3">
                            {visibleConversations.unpinned.map((conversation) => (
                                <ConversationRow key={conversation.id} conversation={conversation} />
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Right: chat */}
                <main className="flex flex-1 flex-col">
                    <header className="flex items-center gap-4 border-b border-gray-200 px-6 py-4">
                        <button
                            type="button"
                            aria-label="Home"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600"
                        >
                            <Home className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">
                                {selectedConversation?.avatarInitials ?? "??"}
                            </div>
                            <div className="leading-tight">
                                <p className="font-medium text-gray-900">{selectedConversation?.displayName ?? ""}</p>
                                <p className="text-sm text-blue-700">
                                    {typingByConversation[selectedConversationId] ? "Typing..." : "Active now"}
                                </p>
                            </div>
                        </div>

                        <div className="ml-auto">
                            <button
                                type="button"
                                aria-label="More"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    </header>

                    <ScrollArea className="flex-1 px-6 py-6">
                        <div className="space-y-6">
                            {(selectedConversation?.messages ?? []).map((m) => (
                                <div
                                    key={m.id}
                                    className={cx(
                                        "flex items-start gap-3",
                                        m.fromSelf ? "justify-end" : "justify-start",
                                    )}
                                >
                                    {!m.fromSelf ? (
                                        <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700">
                                            {m.senderInitials}
                                        </div>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={() => setSelectedMessageId(m.id)}
                                        className={cx(
                                            "max-w-130 rounded-2xl px-4 py-3 text-sm leading-relaxed text-left",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200",
                                            m.fromSelf ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900",
                                            selectedMessageId === m.id ? "ring-2 ring-blue-200" : "",
                                        )}
                                    >
                                        {m.text}
                                        <div
                                            className={cx(
                                                "mt-2 text-xs",
                                                m.fromSelf ? "text-white/70" : "text-gray-500",
                                            )}
                                        >
                                            {m.time}
                                        </div>
                                    </button>

                                    {m.fromSelf ? (
                                        <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700">
                                            {m.senderInitials}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="relative flex items-center gap-3">
                            <button
                                type="button"
                                aria-label="Attach"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600"
                            >
                                <Paperclip className="h-5 w-5" />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    value={composer}
                                    onChange={(e) => setComposer(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />

                                <button
                                    type="button"
                                    aria-label="Emoji"
                                    onClick={() => setEmojiOpen((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-600"
                                >
                                    <Smile className="h-5 w-5" />
                                </button>

                                {emojiOpen ? (
                                    <div className="absolute bottom-14 right-2 z-10 w-55 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                                        <div className="grid grid-cols-8 gap-2">
                                            {EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => handlePickEmoji(emoji)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-50"
                                                    aria-label={`Insert ${emoji}`}
                                                >
                                                    <span className="text-lg">{emoji}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <button
                                type="button"
                                aria-label="Send"
                                onClick={sendMessage}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

