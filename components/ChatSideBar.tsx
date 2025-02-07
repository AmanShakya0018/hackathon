import React, { useState } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChatHistoryItem } from './ChatHistoryItem';
import UserAccountNav from './UserAccountNav';
import SignInButton from './SignInButton';
import { FaLinkedin, FaTwitter } from 'react-icons/fa6';
import { MdDashboard } from "react-icons/md";
import UserAccountSidebar from './UserAccountSidebar';

interface Chat {
  id: string;
  title: string;
  input: string;
  response: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
}) => {
  const { data: session } = useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleChatSelect = (chat: Chat) => {
    onSelectChat(chat);
    closeMobileSidebar();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-neutral-900/95 border-b border-neutral-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileSidebar}
            className="text-white md:hidden"
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Translator
            </span>
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
            <MdDashboard className="h-6 w-6" />
          </Link>
          <Link href="/linkedin" className="text-gray-300 hover:text-white transition-colors">
            <FaLinkedin className="h-5 w-5" />
          </Link>
          <Link href="/twitter" className="text-gray-300 hover:text-white transition-colors">
            <FaTwitter className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div className="group fixed left-0 top-16 bottom-0 w-16 hover:w-64 bg-neutral-900/95 border-r border-neutral-800 transition-all duration-300 ease-in-out flex flex-col">
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md transition-all hover:scale-105 flex items-center justify-center gap-2 group-hover:justify-start"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span className="hidden group-hover:inline truncate">New Chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-0.5">
            {chats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                title={chat.title}
                timestamp={chat.createdAt}
                isActive={activeChat === chat.id}
                onClick={() => onSelectChat(chat)}
                className="truncate group-hover:whitespace-normal px-4 py-2 mx-2 rounded-md"
              />
            ))}
          </div>
        </div>
        <div className="mt-auto p-3 border-t border-gray-800">
          {session?.user ? (
            <div className="px-1">
              <UserAccountSidebar user={session.user} />
            </div>
          ) : (
            <div className="flex items-center justify-center group-hover:justify-start px-1">
              <div className="w-8 group-hover:w-full">
                <SignInButton text="Sign in" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden 
          ${isMobileSidebarOpen ? 'block' : 'hidden'}`}
        onClick={closeMobileSidebar}
      >
        <div
          className={`fixed top-16 bottom-0 left-0 w-64 bg-gray-900/95 border-r border-gray-800 
            transform transition-transform duration-300 ease-in-out 
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-all hover:scale-105 flex items-center justify-start gap-2"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>New Chat</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-0.5">
              {chats.map((chat) => (
                <ChatHistoryItem
                  key={chat.id}
                  title={chat.title}
                  timestamp={chat.createdAt}
                  isActive={activeChat === chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className="px-4 py-2 mx-2 rounded-md"
                />
              ))}
            </div>
          </div>
          <div className="mt-auto p-3 border-t border-gray-800">
            {session?.user ? (
              <div className="px-1">
                <UserAccountNav user={session.user} />
              </div>
            ) : (
              <div className="px-1">
                <SignInButton text="Sign in" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;