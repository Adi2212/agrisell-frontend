import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { notificationApi } from "@/api/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatOrderDateTime } from "@/lib/utils";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token, user } = useAuth();
  
  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.get("");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.put(`/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.put("/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-secondary/10 transition"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border shadow-lg rounded-xl overflow-hidden z-50">
          <div className="flex justify-between items-center p-3 border-b border-border bg-muted/50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 border-b border-border text-sm flex flex-col gap-1 transition ${notif.read ? "bg-background opacity-80" : "bg-primary/5 border-l-2 border-l-primary"}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold font-sm">{notif.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatOrderDateTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{notif.message}</p>
                  
                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="self-end mt-1 text-[10px] font-medium text-primary hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
