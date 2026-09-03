import React from 'react';
import { X } from 'lucide-react';
import { useChat } from '../../context/ChatContext.js';
import { ChatList } from './ChatList.js';
import { ChatWindow } from './ChatWindow.js';

interface ChatDrawerProps {
  onNavigateListing?: (listingId: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ onNavigateListing }) => {
  const {
    isChatDrawerOpen,
    closeChatDrawer,
    conversations,
    activeConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    selectConversation,
    sendMessage,
  } = useChat();

  if (!isChatDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-2 sm:p-6 pointer-events-none">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={closeChatDrawer}
      />

      {/* Floating Messenger Window */}
      <div className="relative w-full max-w-lg sm:max-w-xl h-[85vh] max-h-[640px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 pointer-events-auto animate-fadeIn">
        {/* Main top header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-lime-100 border border-lime-300 text-slate-950 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">DTU Campus Chat</h3>
              <p className="text-[10px] text-slate-500 font-medium">Direct peer-to-peer messaging</p>
            </div>
          </div>

          <button
            onClick={closeChatDrawer}
            className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-hidden">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              isLoading={isLoadingMessages}
              onSendMessage={sendMessage}
              onBack={() => selectConversation('')}
              onNavigateListing={(id) => {
                closeChatDrawer();
                if (onNavigateListing) onNavigateListing(id);
              }}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Recent Conversations ({conversations.length})</span>
              </div>
              <ChatList
                conversations={conversations}
                activeId={undefined}
                onSelect={selectConversation}
                isLoading={isLoadingConversations}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
