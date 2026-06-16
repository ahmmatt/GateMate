import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function ChatPage() {
  const { id } = useParams(); // partner user_id
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Fetch inbox or specific chat
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      try {
        if (!id) {
          // Fetch inbox
          const res = await api.get('/chat');
          setInbox(res.data.data);
        } else {
          // Fetch messages for specific partner
          const res = await api.get(`/chat/${id}`);
          setPartner(res.data.contact);
          setMessages(res.data.messages);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Failed to fetch chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();

    // Simple polling for new messages every 5 seconds if in a chat
    let interval;
    if (id) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/chat/${id}`);
          setMessages(res.data.messages);
        } catch (e) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;
    
    const tempMessage = {
      id: Date.now(),
      sender_id: user.id_user,
      receiver_id: id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    try {
      await api.post(`/chat/${id}`, { content: tempMessage.content });
      // The polling will sync the exact DB object
    } catch (err) {
      alert('Gagal mengirim pesan');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto py-8 px-4 lg:px-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
          {id ? (
            <>
              <button onClick={() => navigate('/chat')} className="material-symbols-outlined hover:text-primary transition-colors text-secondary mr-2">arrow_back</button>
              {partner?.name || 'Chat'}
            </>
          ) : 'Pesan'}
        </h1>
      </div>

      <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-[14px] shadow-sm overflow-hidden flex">
        {/* Inbox Sidebar (hidden on mobile if in chat) */}
        <div className={`${id ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 border-r border-outline-variant bg-surface`}>
          <div className="p-4 border-b border-outline-variant">
            <input type="text" placeholder="Cari percakapan..." className="w-full bg-surface-container-low border-none rounded-full px-4 py-2 font-body-md focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div className="overflow-y-auto flex-1">
            {inbox.length === 0 && !id && (
              <div className="p-8 text-center text-secondary">
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">chat_bubble_outline</span>
                <p>Belum ada percakapan. Mulai networking dari E-Ticket Anda!</p>
              </div>
            )}
            {inbox.map(contact => (
              <Link key={contact.id_user} to={`/chat/${contact.id_user}`} className={`flex items-center gap-4 p-4 border-b border-outline-variant hover:bg-surface-container transition-colors ${parseInt(id) === contact.id_user ? 'bg-primary-fixed/30' : ''}`}>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant flex-shrink-0">
                  <img src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random&color=fff`} alt={contact.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-headline-sm font-bold truncate text-on-surface">{contact.name}</h4>
                    <span className="text-[10px] text-secondary flex-shrink-0">{new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="font-body-md text-secondary truncate">{contact.last_message}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!id ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-2/3 bg-white relative`}>
          {!id ? (
            <div className="flex-1 flex flex-col items-center justify-center text-secondary p-8 text-center">
              <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">forum</span>
              <p className="font-headline-sm">Pilih percakapan untuk mulai mengirim pesan</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-outline-variant flex items-center px-6 bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
                    <img src={partner?.avatar || `https://ui-avatars.com/api/?name=${partner?.name}&background=random&color=fff`} alt={partner?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm font-bold text-on-surface">{partner?.name}</h3>
                    <p className="text-[11px] text-primary font-medium">GateMate Match</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, idx) => {
                    const isMe = parseInt(msg.sender_id) === user.id_user;
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-[18px] ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container text-on-surface rounded-tl-none border border-outline-variant'}`}>
                          <p className="font-body-md text-[15px]">{msg.content}</p>
                          <span className={`text-[10px] block mt-1 ${isMe ? 'text-white/70 text-right' : 'text-secondary text-left'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-full pr-2 border border-outline-variant focus-within:border-primary transition-colors">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-3 font-body-md outline-none"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${newMessage.trim() ? 'bg-primary text-white' : 'bg-surface-variant text-secondary'}`}>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
