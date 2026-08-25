import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, ExternalLink, ShieldCheck, MapPin, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import { Conversation, Message } from '../../types/index.js';
import { formatPrice } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.js';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onBack?: () => void;
  onNavigateListing?: (listingId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  isLoading,
  onSendMessage,
  onBack,
  onNavigateListing,
}) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    try {
      setIsSending(true);
      const text = inputText;
      setInputText('');
      await onSendMessage(text);
    } catch {
      // Ignore
    } finally {
      setIsSending(false);
    }
  };

  const quickReplies = [
    'Is this item still available?',
    'Can we meet at Mic-Mac Canteen?',
    'What is your best price?',
    'I can meet right now!',
  ];

  const handleQuickReply = (text: string) => {
    onSendMessage(text);
  };

  const handleWhatsApp = () => {
    const phone = conversation.partner?.phone?.replace(/\D/g, '') || '919876543210';
    const text = encodeURIComponent(
      `Hi ${conversation.partner?.name}! Chatting with you on DTU Bazaar regarding "${conversation.listing?.title}".`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[560px] max-h-[80vh] bg-campus-card">
      {/* Thread Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors md:hidden"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {conversation.partner?.avatar ? (
            <img
              src={conversation.partner.avatar}
              alt={conversation.partner.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-campus-lime/40 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 text-campus-lime font-bold text-sm flex items-center justify-center flex-shrink-0">
              {conversation.partner?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">
              {conversation.partner?.name || 'DTU Peer'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {conversation.partner?.branch || 'DTU Student'} • {conversation.partner?.hostel || 'Campus'}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Quick WhatsApp button */}
          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] transition-colors"
            title="Chat on WhatsApp"
          >
            <Phone size={15} className="fill-[#25D366]" />
          </button>

          {/* Listing preview pill */}
          {conversation.listing && (
            <div
              onClick={() => onNavigateListing && onNavigateListing(conversation.listingId)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer max-w-[140px] sm:max-w-[200px]"
            >
              {conversation.listing.images?.[0]?.url && (
                <img
                  src={conversation.listing.images[0].url}
                  alt={conversation.listing.title}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">
                  {conversation.listing.title}
                </p>
                <p className="text-[10px] text-campus-lime font-semibold">
                  {formatPrice(conversation.listing.price)}
                </p>
              </div>
              <ExternalLink size={12} className="text-slate-400 flex-shrink-0 hidden sm:block" />
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice Strip */}
      <div className="px-4 py-1.5 bg-blue-500/10 border-b border-blue-500/20 text-blue-300 text-[11px] flex items-center justify-center gap-1.5 font-medium flex-shrink-0">
        <ShieldCheck size={13} className="text-blue-400" />
        <span>Meet inside DTU campus (Mic-Mac, OAT, Hostels) & test items before paying.</span>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#090E1B]">
        {isLoading ? (
          <div className="space-y-3 pt-6">
            <div className="h-10 w-2/3 rounded-2xl bg-slate-800/40 animate-pulse" />
            <div className="h-10 w-1/2 ml-auto rounded-2xl bg-campus-lime/10 animate-pulse" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Start the conversation with {conversation.partner?.name || 'the student'}!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const isOffer = msg.text.includes('PRICE OFFER:');
            const timeStr = new Date(msg.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {isOffer ? (
                  // Styled Negotiation Offer Card
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm border ${
                      isMe
                        ? 'bg-campus-lime/15 border-campus-lime text-white rounded-tr-none shadow-glow'
                        : 'bg-slate-900 border-campus-lime/40 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-campus-lime font-black text-xs uppercase tracking-wider mb-1.5">
                      <Sparkles size={14} />
                      <span>Formal Price Offer</span>
                    </div>
                    <p className="font-semibold text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    {!isMe && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => onSendMessage(`🤝 I accept your offer! Let's meet at Mic-Mac Canteen.`)}
                          className="px-2.5 py-1 rounded-lg bg-campus-lime text-black font-bold text-xs hover:bg-campus-lime-hover active:scale-95"
                        >
                          Accept Offer
                        </button>
                        <button
                          onClick={() => onSendMessage(`Sorry, that is too low. What about ₹${Math.round(Number(conversation.listing?.price || 500) * 0.95)}?`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 active:scale-95"
                        >
                          Counter
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular Chat Bubble
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                      isMe
                        ? 'bg-campus-lime text-black font-medium rounded-tr-none shadow-glow'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 mt-1 px-1">{timeStr}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleQuickReply(reply)}
            className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-campus-lime border border-slate-700 transition-colors active:scale-95"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${conversation.partner?.name?.split(' ')[0] || 'student'}...`}
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-campus-lime transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2.5 rounded-xl bg-campus-lime text-black hover:bg-campus-lime-hover font-bold disabled:opacity-40 disabled:pointer-events-none transition-all shadow-glow flex-shrink-0 active:scale-95"
        >
          <Send size={16} className="stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};
