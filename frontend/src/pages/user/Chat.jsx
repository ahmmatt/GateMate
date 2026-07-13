import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../lib/api';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCurrentUser(user);

    // Initial load
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const res = await api.get('/chat');
      if (res.data.success) {
        let fetchedContacts = res.data.data;
        
        // If navigating from TicketDetail with a target user
        if (location.state?.targetUserId) {
          const targetId = location.state.targetUserId;
          const targetName = location.state.targetUserName || 'Participant';
          
          const exists = fetchedContacts.find(c => c.id_user === targetId);
          if (!exists) {
            fetchedContacts = [{
              id_user: targetId,
              name: targetName,
              avatar: null,
              last_message: '',
              time: '',
              unread: 0
            }, ...fetchedContacts];
          }
          
          setContacts(fetchedContacts);
          const active = fetchedContacts.find(c => c.id_user === targetId);
          setActiveContact(active);
          fetchMessages(active.id_user);
          
          // Clear history state so refresh doesn't force it
          window.history.replaceState({}, document.title);
        } else {
          setContacts(fetchedContacts);
          if (fetchedContacts.length > 0 && !activeContact) {
            setActiveContact(fetchedContacts[0]);
            fetchMessages(fetchedContacts[0].id_user);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch inbox', err);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const res = await api.get(`/chat/${contactId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
        
        // If we didn't have the contact's avatar or name updated, update it
        if (res.data.contact) {
          setActiveContact(prev => prev ? { ...prev, ...res.data.contact } : res.data.contact);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '' && activeContact) {
      const content = inputValue;
      setInputValue('');
      
      // Optimistic update
      const tempMsg = {
        id: Date.now(),
        sender_id: currentUser?.id_user,
        receiver_id: activeContact.id_user,
        content: content,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);

      try {
        await api.post(`/chat/${activeContact.id_user}`, { content });
        fetchMessages(activeContact.id_user);
        fetchInbox(); // Refresh inbox for last_message
      } catch (err) {
        console.error('Failed to send message', err);
        // Revert optimistic update here if needed
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Set up polling for messages
  useEffect(() => {
    if (!activeContact) return;
    
    const interval = setInterval(() => {
      fetchMessages(activeContact.id_user);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeContact]);

  const selectContact = (contact) => {
    setActiveContact(contact);
    fetchMessages(contact.id_user);
  };

  return (
    <div className="bg-[#fff8f6] text-[#271815] overflow-hidden h-screen flex flex-col font-body-md">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #e3beb8; border-radius: 10px; }
      `}} />

      {/* TopAppBar Execution */}
      <header className="bg-surface border-b-[0.5px] border-outline-variant flex justify-between items-center w-full px-container-padding h-16 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>GateMate</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/events')}>Explore</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/tickets')}>My Tickets</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/wallet')}>Wallet</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer" onClick={() => navigate('/user/profile')}>
            {currentUser?.profile_picture_url ? (
              <img alt="User profile" src={currentUser.profile_picture_url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.full_name ? currentUser.full_name.substring(0, 2).toUpperCase() : 'ME'}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Conversations */}
        <aside className="w-80 lg:w-96 bg-surface-container-lowest border-r-[0.5px] border-outline-variant flex flex-col h-full">
          <div className="p-container-padding">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Messages</h2>
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full bg-surface border-outline-variant border-[0.5px] rounded-xl py-2 pl-10 pr-4 text-body-md font-body-md focus:border-primary focus:ring-0 transition-all outline-none" placeholder="Search conversations..." type="text"/>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto chat-scroll">
            
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-secondary text-sm">
                Belum ada pesan. Mulai ngobrol di Networking Hub!
              </div>
            ) : null}

            {contacts.map((contact) => (
              <div 
                key={contact.id_user} 
                onClick={() => selectContact(contact)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b-[0.5px] border-outline-variant/30 ${activeContact?.id_user === contact.id_user ? 'bg-surface-container border-r-2 border-primary' : 'hover:bg-surface-container-low'}`}
              >
                <div className="h-12 w-12 flex-shrink-0 relative">
                  {contact.avatar ? (
                    <img alt={contact.name} className="h-full w-full rounded-full object-cover border border-outline-variant" src={contact.avatar}/>
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {contact.name ? contact.name.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                  )}
                  {/* Status indicator can be added here if needed */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-label-md text-label-md truncate ${activeContact?.id_user === contact.id_user ? 'text-primary font-bold' : 'text-on-surface font-medium'}`}>
                      {contact.name}
                    </h3>
                    <span className="text-[10px] text-outline">
                      {contact.time ? new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <p className="text-body-md text-body-md text-secondary truncate">{contact.last_message || 'Belum ada pesan'}</p>
                </div>
              </div>
            ))}

          </div>
        </aside>

        {/* Right Pane: Chat Window */}
        <section className="flex-1 flex flex-col bg-white">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center bg-[#fff8f6]/30">
              <p className="text-secondary text-lg">Pilih obrolan untuk mulai mengirim pesan</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="h-16 border-b-[0.5px] border-outline-variant px-container-padding flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant">
                    {activeContact.avatar ? (
                      <img alt={activeContact.name} src={activeContact.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {activeContact.name ? activeContact.name.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">{activeContact.name}</h2>
                    <p className="text-[11px] text-secondary font-medium">Networking Partner</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">info</button>
                </div>
              </header>

              {/* Messages Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-container-padding flex flex-col gap-4 chat-scroll bg-[#fff8f6]/30">
                
                {messages.length === 0 ? (
                  <div className="flex justify-center my-4">
                    <span className="bg-surface-container-high px-3 py-1 rounded-full text-[12px] font-medium text-outline tracking-wider text-center">
                      Mulai percakapan dengan {activeContact.name}.<br/>Kirimkan pesan pertama Anda!
                    </span>
                  </div>
                ) : null}

                {messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id_user;
                  return (
                    <div key={msg.id} className={`flex flex-col items-${isMe ? 'end' : 'start'} gap-1 ${isMe ? 'ml-auto' : ''} max-w-[70%]`}>
                      <div className={`${isMe ? 'bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm' : 'bg-surface-container p-3 rounded-2xl rounded-tl-none border border-outline-variant/30'}`}>
                        <p className={`text-body-md ${!isMe ? 'text-on-surface' : ''}`}>{msg.content}</p>
                      </div>
                      {isMe ? (
                        <div className="flex items-center gap-1 mr-1">
                          <span className="text-[10px] text-outline">
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>done_all</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-outline ml-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <footer className="p-container-padding bg-white border-t-[0.5px] border-outline-variant">
                <div className="max-w-4xl mx-auto flex items-end gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 shadow-sm focus-within:border-primary transition-all">
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-body-md font-body-md py-2 px-2 resize-none max-h-32 outline-none" 
                    placeholder="Write a message..." 
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={handleSendMessage} className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                  </button>
                </div>
                <p className="text-[11px] text-center text-outline mt-3 font-medium">End-to-end encrypted by GateMate Protocol</p>
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
