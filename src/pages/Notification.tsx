import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { getNotification } from '../backend/notification'; // Fixed import path
import { Bell, CheckCircle2, AlertCircle, Info, XCircle, Clock } from 'lucide-react';

const NotificationList: React.FC = () => {
    type NotificationItem = {
        id: number;
        notify: string;
        read: boolean;
        timestamp?: string; // Optional for now, but good for UI
        type?: 'info' | 'success' | 'warning' | 'error';
    }
    // State
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // WebSocket Configuration
    // Note: In a real app, manage this token securely.
    const socketUrl = `ws://127.0.0.1:8000/ws/notify/?token=${localStorage.getItem("cookie") || ""}`;
    
    const { lastJsonMessage } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
        reconnectAttempts: 3,
        reconnectInterval: 3000,
        onError: () => {
           // Silently handle error for UI demo purposes, or set generic error
           console.log("WS connection error - Make sure backend is running");
        }
    });

    // Handle incoming WS messages
    useEffect(() => {
        if (!lastJsonMessage) return;

        // Type guard or casting for the message
        const message = lastJsonMessage as any;
        
        if (message && message.id && message.notify) {
            setNotifications((prev) => {
                // Prevent duplicates if ID exists
                if (prev.some(n => n.id === message.id)) return prev;
                
                const newNote: NotificationItem = {
                    id: message.id,
                    notify: message.notify,
                    read: false,
                    type: 'info', // Default type
                    timestamp: 'Just now'
                };
                return [newNote, ...prev];
            });
        }
    }, [lastJsonMessage]);

    // Initial Fetch
    useEffect(() => {
        setIsLoading(true);
        getNotification()
            .then((data) => {
                setNotifications((prev) => {
                    // Merge strategies can vary. Here we deduplicate by ID.
                    const existingIds = new Set(prev.map(n => n.id));
                    const uniqueNew = data.filter((d:any) => !existingIds.has(d.id));
                    return [...prev, ...uniqueNew];
                });
                setIsLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setError("Failed to load notifications");
                setIsLoading(false);
            });
    }, []);

    // Helper to get icon based on type
    const getIcon = (type?: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-green-500" size={18} />;
            case 'warning': return <AlertCircle className="text-orange-500" size={18} />;
            case 'error': return <XCircle className="text-red-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    if (isLoading && notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Loading notifications...</p>
            </div>
        );
    }

    if (error && notifications.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center py-10 space-y-2 text-center">
                <AlertCircle className="text-gray-300" size={32} />
                <p className="text-gray-500 text-sm">{error}</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                    <Bell className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-900 font-medium text-sm">No notifications yet</p>
                <p className="text-gray-500 text-xs mt-1">We'll let you know when something arrives.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100">
            {notifications.map((note) => (
                <div 
                    key={note.id} 
                    className={`
                        p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group flex gap-3 items-start
                        ${!note.read ? 'bg-blue-50/40' : 'bg-white'}
                    `}
                >
                    <div className="mt-0.5 flex-shrink-0">
                        {getIcon(note.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className={`text-sm leading-snug ${!note.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {note.notify}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            {note.timestamp && (
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {note.timestamp}
                                </span>
                            )}
                        </div>
                    </div>
                    {!note.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
