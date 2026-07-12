import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: "Hello! I'm interested in the Front Row ticket for the networking gala. Is it still available for verification?",
      time: "10:42 AM",
    },
    {
      id: 2,
      sender: 'me',
      text: "Hi Budi! Yes, it's still available. I just uploaded the GateMate QR for you to verify on your end.",
      time: "10:44 AM",
    },
    {
      id: 3,
      sender: 'them',
      text: "That sounds perfect, let's meet at the venue main entrance once the verification clears. I'll initiate the wallet transfer now.",
      time: "10:45 AM",
    }
  ]);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'me',
        text: inputValue,
        time: "Just now"
      }]);
      setInputValue('');
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
            <a className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer" onClick={() => navigate('/events')}>Jelajahi</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/tickets')}>My Tickets</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/wallet')}>Wallet</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
          <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">settings</button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer" onClick={() => navigate('/user/profile')}>
            <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZpZKCnyhiUMWXOhqjrFoVoGqtGLhdUJUSoIKjuh1m3KGnstR1ml3wjoSgOIQq9MRxhjK8M-SdaceyufjDxUygqrZgn7Gc9QBXz8j5MPSNxiFAgcqw13h4zsKihBr1-5ZodOhn2yVtwkfykbN3ubvikcRUEyDPexxoM3WZOrjDRdjnvyBugldPCDx4luR1MlDcv-wuJCD5x07ftAkUEojEAQ0mFPx0pKE3LC8wZkBji2dlCM9d1JWKvsLyagwssXLtluET7dNCiHE"/>
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
            
            {/* Best Match Chat */}
            <div className="flex items-center gap-3 p-4 bg-surface-container border-r-2 border-primary cursor-pointer group transition-all">
              <div className="relative h-12 w-12 flex-shrink-0">
                <img alt="Budi Santoso" className="h-full w-full rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLyyrfMwstQOnCKsYmGvdumsOJPwfMpsEqfhEaiKDCxC1qmBN9UtSNnWA_TbmiyIrJ4v8m5AkCJ3dM-4nfpXzTsSfrudu9c_z_PpB-Z8CIi88AGpnQEOvyUXby-t24e7Gf8wAQx3v73417E_2dz-7LaFFJ7WghF4YdLaeY-E8imKYR_kLcx-wpsARyK4-RpD0xLZJH_6sLQXn7w6Z16djex4aiKKNxzEWOb3lrqbyYxAazAIE4Y3Bw4S57VAQmRzb5-LzqToB6mTM"/>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-label-md text-label-md text-primary font-bold truncate">Budi Santoso</h3>
                  <span className="text-[10px] text-outline">10:45 AM</span>
                </div>
                <p className="text-body-md text-body-md text-on-surface truncate">That sounds perfect, let's meet at...</p>
                <div className="mt-1">
                  <span className="bg-surface-container-low text-primary text-[10px] px-2 py-0.5 rounded-full font-bold border border-primary/20">Best Match</span>
                </div>
              </div>
            </div>

            {/* Other Chat 1 */}
            <div className="flex items-center gap-3 p-4 hover:bg-surface-container-low cursor-pointer transition-all border-b-[0.5px] border-outline-variant/30">
              <div className="h-12 w-12 flex-shrink-0">
                <img alt="Siti Aminah" className="h-full w-full rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxJA1IJrJNXpcsMluGa5H921vPHCocSUc2V2WXzDLk8yWA9NHiFaHBYxSa1VybiemMPpqSqrP1g_s7w8vMIxq2Nbdi1URch9mbaXevgKL8yNjAxCDDQSW2xDr4c84lB88k02l_QAFlVlqfhE0Ln_jlqBDqZTX8rcEZOAJVoj3sbZ_0lvjbAF-wQxsw99lFFRSCKTwo-NNNrgh9Vdz57IqfoeWavPBR5jIq6KhZLXkuCDZ9xsvmKrSSjjeB6XJc9V-bLDovTLo17G8"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-label-md text-label-md text-on-surface font-medium truncate">Siti Aminah</h3>
                  <span className="text-[10px] text-outline">Yesterday</span>
                </div>
                <p className="text-body-md text-body-md text-secondary truncate">Has the ticket been verified yet?</p>
              </div>
            </div>

            {/* Other Chat 2 */}
            <div className="flex items-center gap-3 p-4 hover:bg-surface-container-low cursor-pointer transition-all border-b-[0.5px] border-outline-variant/30">
              <div className="h-12 w-12 flex-shrink-0">
                <img alt="Arif Wijaya" className="h-full w-full rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBetpoAoB1pbPRrwsVvkei63WvD4wz8M42OsH5lJBa4_fOitENzTgKd50_Nebo2RTWXiU47gf1aCBqZPuGg8K_xMsWaZBfWSovdWghv4RtpHLhbDtnJLyAYNYj832H61nrMCNT36-0O6v5KQUhIrTkiirFrpejegrNl1KB6CedWq4ZZtZ9TBPDiMyguJHDak3dTkSETBHB55D8jtwgpU8qNAW3CScVqjtTWHdKQr0umF9Kx-saW3Wl9b0b_6lOI_KWLFhNQzbyxJCs"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-label-md text-label-md text-on-surface font-medium truncate">Arif Wijaya</h3>
                  <span className="text-[10px] text-outline">Tue</span>
                </div>
                <p className="text-body-md text-body-md text-secondary truncate">I sent the transaction ID over...</p>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Pane: Chat Window */}
        <section className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <header className="h-16 border-b-[0.5px] border-outline-variant px-container-padding flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant">
                <img alt="Budi Santoso" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARg4UxBmrD_Qg4HbtpxqXL35eIG4pNhHhKWzQ6f4F_6BajwTDxjL9g0skLgdgG3JezHUx_6AwXyeKkE-aWYN1cD74KIO3alJwDisATDzhbKa1YpAmDOlTqAmqNlMwgdZojt_T7hDUYvEuy7c14FnF6vOHcJZqzBRgQ8bBSZCQdSTE7r79400LLiN9pkzEAn4-N7SDd6gYKAzBeAO7UpBxE8hUjp0CVd7b-lHzJ7XEbS2FAfHRhJre2DJ-KvLavOpiBXT3akWKMvQA"/>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Budi Santoso</h2>
                <p className="text-[11px] text-secondary font-medium">Tech & Coffee Enthusiast • Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">call</button>
              <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">videocam</button>
              <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">info</button>
            </div>
          </header>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-container-padding flex flex-col gap-4 chat-scroll bg-[#fff8f6]/30">
            {/* Date Divider */}
            <div className="flex justify-center my-4">
              <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold text-outline uppercase tracking-wider">Today</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col items-${msg.sender === 'me' ? 'end' : 'start'} gap-1 ${msg.sender === 'me' ? 'ml-auto' : ''} max-w-[70%]`}>
                <div className={`${msg.sender === 'me' ? 'bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm' : 'bg-surface-container p-3 rounded-2xl rounded-tl-none border border-outline-variant/30'}`}>
                  <p className={`text-body-md ${msg.sender === 'them' ? 'text-on-surface' : ''}`}>{msg.text}</p>
                </div>
                {msg.sender === 'me' ? (
                  <div className="flex items-center gap-1 mr-1">
                    <span className="text-[10px] text-outline">{msg.time}</span>
                    <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>done_all</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-outline ml-1">{msg.time}</span>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <footer className="p-container-padding bg-white border-t-[0.5px] border-outline-variant">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 shadow-sm focus-within:border-primary transition-all">
              <button className="material-symbols-outlined text-outline hover:text-primary p-2 transition-colors">add_circle</button>
              <button className="material-symbols-outlined text-outline hover:text-primary p-2 transition-colors">attach_file</button>
              <textarea 
                className="flex-1 bg-transparent border-none focus:ring-0 text-body-md font-body-md py-2 resize-none max-h-32 outline-none" 
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
        </section>
      </main>
    </div>
  );
}
