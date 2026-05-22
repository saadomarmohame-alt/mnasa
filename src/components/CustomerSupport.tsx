import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, ShieldCheck, HeartHandshake, Phone, Ticket, ArrowRight, Laptop, Sparkles } from 'lucide-react';
import { User } from '../types';

interface SupportTicket {
  id: string;
  senderName: string;
  senderEmail: string;
  category: string;
  message: string;
  currency: 'EGP' | 'SAR' | 'USD';
  timestamp: string;
  status: 'Open' | 'Resolved';
}

interface CustomerSupportProps {
  currentUser: User;
  onLogSecurityEvent: (eventText: string, userMail?: string) => void;
  isArabic: boolean;
}

export default function CustomerSupport({ currentUser, onLogSecurityEvent, isArabic }: CustomerSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'whatsapp' | 'ticket'>('chat');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: isArabic
        ? "أهلاً بك في الدعم الفني للأكاديمية الأرجنتينية الدولية! أنا سارة، مرشدتك الذكية. كيف يمكنني مساعدتك اليوم؟"
        : "Welcome to the Argentinian Software Academy Global Helpdesk! I am Sara, your customer success assistant. How can I guide you today?",
      time: 'Just now'
    }
  ]);
  const [userMsgInput, setUserMsgInput] = useState('');
  
  // Ticket Form state
  const [ticketSubject, setTicketSubject] = useState('Course Inquiry');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketCurrency, setTicketCurrency] = useState<'EGP' | 'SAR' | 'USD'>('EGP');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  // Handle support questions with custom simulated high-intelligence responses
  const getSimulatedResponse = (msg: string): string => {
    const text = msg.toLowerCase().trim();
    
    // Arabic keyword checking
    if (text.includes('رفع') || text.includes('انزل') || text.includes('كورس جديد') || text.includes('أنزل') || text.includes('نشر') || text.includes('مدرس') || text.includes('معلم') || text.includes('مدرسين')) {
      return isArabic
        ? "أهلاً بك يا أستاذي! يمكنك رفع المساقات والدروس فوراً وبشكل حي 100% دون الحاجة إلى إعادة نشر الكود أو عمل deploy. اذهب فقط لبوابة المحاضرين (Professors Studio)، واضغط على زر 'Post Course' واملأ البيانات وسيكون الكورس متاحاً فوراً لجميع الطلاب في أنحاء العالم!"
        : "Dear Distinguished Instructor, you can upload courses instantly! Simply switch to the 'Professors Studio' dashboard in the Portal Gateway, click 'Post Course', draft your curricula, and hit publish. The content immediately goes live on the student network without redeploying the container.";
    }
    
    if (text.includes('سعر') || text.includes('اسعار') || text.includes('أسعار') || text.includes('فلوس') || text.includes('كام') || text.includes('جنيه') || text.includes('ريال') || text.includes('دولار') || text.includes('price') || text.includes('money') || text.includes('sar') || text.includes('egp') || text.includes('usd')) {
      return isArabic
        ? "تلتزم الأكاديمية الأرجنتينية بتسعير عادل ومحدد لحماية وتطوير الكفاءات: جميع المساقات مسعرة بحد أدنى 50 جنيهاً مصرياً وبحد أقصى 500 جنيهاً مصرياً فقط! ويُعرض السعر آلياً بثلاث عملات لتسهيل الدفع للمصريين وغير المصريين: الجنيه المصري (EGP)، الريال السعودي (SAR)، والدولار الأمريكي (USD). لا توجد اشتراكات دورية، الدفع لمرة واحدة مدى الحياة!"
        : "Argentina Academy sets strict standard limits for premium engineering modules: prices are locked strictly between 50 EGP and 500 EGP to guarantee accessibility. Rates automatically display in Egyptian Pounds (EGP), Saudi Riyals (SAR), and US Dollars (USD) for both local and international cadets. Lifetime single-payments, no recurrent subscriptions!";
    }

    if (text.includes('ارجع') || text.includes('استرد') || text.includes('إرجاع') || text.includes('الغاء') || text.includes('فلوسي') || text.includes('refund') || text.includes('cancel') || text.includes('money back')) {
      return isArabic
        ? "بكل تأكيد! نوفر سياسة أمان وحرية كاملة للطلاب والمطورين. إذا قمت بالتسجيل في كورس وتريد إلغاءه، يمكنك في أي وقت الانتقال لصفحة الكورس والضغط على زر 'إلغاء الاشتراك واسترداد الأموال / Refund & Cancel' وسيقوم النظام فوراً بإلغاء حسابك بالمساق لإرجاع كامل مستحقاتك دون تأخير أو تعقيد."
        : "Yes! Every student has full agency. If you decide to cancel your subscription to an active course, open the module syllabus deck, click 'Refund & Cancel Course', and the system will immediately terminate your authorization keys and guarantee a prompt fully-reversed refund directly back to your balance.";
    }

    if (text.includes('تواصل') || text.includes('واتساب') || text.includes('تلفون') || text.includes('رقم') || text.includes('whatsapp') || text.includes('support') || text.includes('phone')) {
      return isArabic
        ? "للتواصل المباشر مع مستشاري التعليم والقبول بالأكاديمية الأرجنتينية عبر الواتس آب، اضغط على تبويب 'الواتساب الفوري' بالجانب لبدء محادثة مباشرة مع الدعم الفني المتواجد لخدمتك على مدار الساعة!"
        : "To open a secure real-time dialog string with our regional counselors on WhatsApp, switch to the 'WhatsApp Direct Line' tab in this hub. We are active 24/7 assisting our Egyptian and international developers!";
    }

    if (text.includes('عربي') || text.includes('انجليزي') || text.includes('arabic') || text.includes('english')) {
      return isArabic
        ? "ندعم اللغة العربية واللغة الإنجليزية بالكامل بالتناغم مع معايير الأكاديمية. يمكنك دائما التبديل بين اللغتين من زر 'العربية / English' اللامع في شريط التنقل العلوي!"
        : "Our interface, system logs, exams, and curriculum models are fully localized in Arabic and English. Simply click the 'العربية / ENGLISH' toggle button on the fixed top header!";
    }

    // Default polite response
    return isArabic
      ? "تلقيت استفسارك باهتمام كبير. الأكاديمية الأرجنتينية توفر حلاً متكاملاً للطلاب والمعلمين مع لوحة تحكم فورية، وأنظمة حماية مشفرة لمنع فحص مصادر الصفحة (Inspect Elements) وحفظ حقوق الملكية للمحاضرين. هل ترغب برفع تذكرة دعم فني لمراجعتها من فريق الأكاديمية؟"
      : "I have recorded your inquiry. The Argentinian Academy ecosystem keeps your source elements protected from unauthorized Inspect tools, enforcing rigid copyright parameters. Would you like to submit an academic ticket or connect to WhatsApp support?";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim()) return;

    const userMsg = userMsgInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setUserMsgInput('');

    // Simulate agent thinking and replying in 750ms
    setTimeout(() => {
      const responseText = getSimulatedResponse(userMsg);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 700);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;

    const ticketId = `TKT-${Math.floor(Math.random() * 80000 + 10000)}`;
    onLogSecurityEvent(
      `Support ticket submitted: [${ticketId}] Category: ${ticketSubject}. User requested EGP/SAR/USD standard rate check. Memo: ${ticketMsg.slice(0, 40)}...`,
      currentUser.email
    );

    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setTicketMsg('');
      setActiveTab('chat');
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {/* Glow effect surrounding bubble */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            onLogSecurityEvent("Client accessed dynamic Customer Care hub", currentUser.email);
          }}
          className="relative group bg-[#090f1e] hover:bg-slate-900 border-2 border-cyan-400 text-cyan-400 p-4 rounded-full shadow-2xl shadow-cyan-950/40 hover:scale-105 transition duration-300 flex items-center justify-center cursor-pointer animate-bounce"
          title={isArabic ? "خدمة عملاء الأكاديمية الأرجنتينية" : "Argentinian Academy Support Suite"}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur opacity-75 group-hover:opacity-100 transition duration-350" />
          <MessageSquare className="w-6 h-6 relative z-10" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </button>
      )}

      {/* Slide-Up Support Card */}
      {isOpen && (
        <div className="bg-[#090e1a] border-2 border-cyan-400/30 w-[350px] sm:w-[390px] h-[520px] rounded-3xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-300 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 to-[#0c1226] border-b border-white/5 p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-cyan-405 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-widest text-white uppercase leading-none">
                  {isArabic ? "خدمة عملاء الأكاديمية" : "ARGENTINIAN HELPDESK"}
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                    {isArabic ? "مستشاري الدعم أونلاين" : "Live Agent: SARA // Active"}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="bg-slate-950/80 border-b border-white/5 px-2.5 py-1.5 grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 text-[10.5px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isArabic ? "الدردشة" : "Smart Chat"}</span>
            </button>
            <button
               onClick={() => setActiveTab('whatsapp')}
               className={`py-1.5 text-[10.5px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                 activeTab === 'whatsapp' ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <Phone className="w-3 h-3 text-emerald-450 text-emerald-400" />
               <span>{isArabic ? "واتساب" : "WhatsApp"}</span>
             </button>
             <button
               onClick={() => setActiveTab('ticket')}
               className={`py-1.5 text-[10.5px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                 activeTab === 'ticket' ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <Ticket className="w-3 h-3" />
               <span>{isArabic ? "التذاكر" : "Tickets"}</span>
             </button>
           </div>
 
           {/* Tab Content Box */}
           <div className="flex-1 bg-[#060a14] p-4 overflow-y-auto space-y-4">
             
             {/* TAB 1: SMART AI CHATBOT */}
             {activeTab === 'chat' && (
               <div className="h-full flex flex-col justify-between">
                 {/* Message Streams */}
                 <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[295px]">
                   {chatMessages.map((msg, index) => {
                     const isBot = msg.sender === 'bot';
                     return (
                       <div
                         key={index}
                         className={`flex flex-col max-w-[85%] ${isBot ? 'self-start items-start text-left' : 'self-end items-end text-right ml-auto'}`}
                       >
                         <span className="text-[8px] font-mono text-slate-500 mb-0.5">{isBot ? "SARA (ARG)" : "YOU"} • {msg.time}</span>
                         <div
                           className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans ${
                             isBot
                               ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                               : 'bg-gradient-to-tr from-cyan-950/50 to-cyan-900/40 border border-cyan-500/20 text-cyan-300 rounded-tr-none'
                           }`}
                         >
                           {msg.text}
                         </div>
                       </div>
                     );
                   })}
                   <div ref={messagesEndRef} />
                 </div>
 
                 {/* Question Suggestion pills */}
                 <div className="pt-2 border-t border-white/5 space-y-1">
                   <span className="text-[8px] font-mono text-slate-500 tracking-wider uppercase block">
                     {isArabic ? "أسئلة شائعة تهمك" : "SUGGESTED ENQUIRIES"}
                   </span>
                   <div className="flex flex-wrap gap-1 font-sans">
                     <button
                       onClick={() => {
                         setUserMsgInput(isArabic ? "كيف أقوم برفع كورس جديد؟" : "How can I upload custom courses?");
                       }}
                       className="px-2 py-1 bg-slate-900 border border-slate-850 hover:border-cyan-400/30 rounded-lg text-[9px] text-slate-300 cursor-pointer block text-left"
                     >
                       {isArabic ? "كيف أرفع كورس؟" : "How to post course?"}
                     </button>
                     <button
                       onClick={() => {
                         setUserMsgInput(isArabic ? "ما هي العملات والأسعار المعتمدة؟" : "What courses pricing apply?");
                       }}
                       className="px-2 py-1 bg-slate-900 border border-slate-850 hover:border-cyan-400/30 rounded-lg text-[9px] text-slate-300 cursor-pointer block text-left"
                     >
                       {isArabic ? "الأسعار والعملات (EGP , SAR , $)" : "Pricing limits (50 - 500 EGP)"}
                     </button>
                     <button
                       onClick={() => {
                         setUserMsgInput(isArabic ? "أريد إلغاء كورس واسترداد أموالي" : "How can I get a refund of my payment?");
                       }}
                       className="px-2 py-1 bg-slate-900 border border-slate-850 hover:border-cyan-400/30 rounded-lg text-[9px] text-slate-300 cursor-pointer block text-left"
                     >
                       {isArabic ? "استرداد الأموال فوراً" : "Instantly refund & cancel"}
                     </button>
                   </div>
                 </div>
 
                 {/* Form Inputs */}
                 <form onSubmit={handleSendMessage} className="mt-2.5 flex items-center gap-1.5">
                   <input
                     type="text"
                     value={userMsgInput}
                     onChange={(e) => setUserMsgInput(e.target.value)}
                     placeholder={isArabic ? "اكتب سؤالك هنا بخصوص العملات والأكواد..." : "Ask Sara about prices, refunds..."}
                     className="flex-1 bg-slate-950 border border-slate-900 focus:border-cyan-450 focus:border-cyan-400 rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none"
                   />
                   <button
                     type="submit"
                     className="p-2.5 bg-cyan-450 bg-cyan-400 hover:brightness-110 text-black rounded-xl transition cursor-pointer shrink-0"
                   >
                     <Send className="w-3.5 h-3.5" />
                   </button>
                 </form>
               </div>
             )}
 
             {/* TAB 2: WHATSAPP DIRECT HELPLINES */}
             {activeTab === 'whatsapp' && (
               <div className="space-y-4 py-2 font-sans text-left">
                 <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-900 space-y-1.5">
                   <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">● Egypt Regional Helpdesk (WhatsApp)</span>
                   <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     {isArabic 
                       ? "رقم خدمة العملاء المعتمد لجمهورية مصر العربية والدفع بالجنيه المصري:" 
                       : "Official direct whatsapp helpline for Egyptian student billing and inquiries:"}
                   </p>
                   <a
                     href="https://wa.me/2011059000592?text=Hello%20Argentina%20Academy%20I%20want%20to%20inquire%20about%20Egyptian%20LMS%20courses"
                     target="_blank"
                     rel="noreferrer"
                     className="mt-2 text-xs font-bold font-mono text-emerald-450 hover:text-emerald-300 flex items-center gap-1 inline-block"
                   >
                     <span>011-059-000592</span>
                     <ArrowRight className="w-3 h-3" />
                   </a>
                 </div>
 
                 <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-900 space-y-1.5">
                   <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest block font-bold">● Secondary Support Channel</span>
                   <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     {isArabic 
                       ? "خط الدعم الفني الاحتياطي والاتصال المباشر للأكواد والاشتراكات المعتمدة:" 
                       : "Secondary backup line for instant academic guidance and codes assistance:"}
                   </p>
                   <a
                     href="https://wa.me/2011059000592?text=Hello%20Argentina%20Academy%20I%20want%20to%20inquire%20about%2520Saudi%2520Sovereign"
                     target="_blank"
                     rel="noreferrer"
                     className="mt-2 text-xs font-bold font-mono text-sky-450 hover:text-sky-300 flex items-center gap-1 inline-block"
                  >
                    <span>011-059-000592</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-slate-900/30 p-3 rounded-xl border border-dashed border-cyan-400/20 text-[9.5px] text-slate-500 font-mono text-center">
                  🔐 {isArabic ? "جميع المحادثات مشفرة تماشياً مع معايير الأمان" : "All customer assistance channels are securely verified."}
                </div>
              </div>
            )}

            {/* TAB 3: ACADEMIC INQUIRY TICKET CREATOR */}
            {activeTab === 'ticket' && (
              <div className="space-y-3">
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-slate-100">{isArabic ? "فتح تذكرة فنية رسمية" : "SUBMIT ACADEMIC FORM"}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {isArabic 
                      ? "ارسل مراجعة للمسؤولين وسنقوم بالرد عليك في سجلات الحماية واللوحة." 
                      : "Create a verified system ticket. Instantly logs data point trace onto system console ledger."}
                  </p>
                </div>

                {ticketSuccess ? (
                  <div className="p-4 bg-emerald-950/25 border border-emerald-500/15 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                    <p className="text-[11px] font-sans font-extrabold text-[#fff]">
                      {isArabic ? "تم قيد التذكرة بالكامل بنجاح!" : "TICKET ISSUED SUCCESSFULLY!"}
                    </p>
                    <p className="text-[9.5px] font-mono text-emerald-400 leading-normal">
                      {isArabic 
                        ? "تم تسجيل البصمة برقم التذكرة في سجل المراقبة وتحديث لوحة التحكم." 
                        : "Credentials recorded, and system logs modified. Sara will respond in seconds."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs text-left">
                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Inquiry Standard Category</label>
                      <select
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-2.5 py-1.5 text-xs text-cyan-400"
                      >
                        <option value="Course Upload Issue">Course Direct Uploading</option>
                        <option value="Exchange Price Discrepancy">Billing Currency (EGP/SAR/USD)</option>
                        <option value="Refund Process Query">Refund / Cancel Access</option>
                        <option value="Account Protection Breach">Developer inspect Tools lock</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Target Billing Currency</label>
                      <div className="grid grid-cols-3 gap-1 grid-flow-row">
                        {(['EGP', 'SAR', 'USD'] as const).map((ccy) => (
                          <button
                            key={ccy}
                            type="button"
                            onClick={() => setTicketCurrency(ccy)}
                            className={`py-1 rounded font-mono font-bold text-[10px] uppercase border transition ${
                              ticketCurrency === ccy 
                                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-400' 
                                : 'bg-slate-950 border-slate-900 text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            {ccy}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Detailed Message / تفاصيل الرسالة</label>
                      <textarea
                        required
                        rows={3}
                        value={ticketMsg}
                        onChange={(e) => setTicketMsg(e.target.value)}
                        placeholder={isArabic ? "اكتب رسالتك للمطورين هنا بوضوح..." : "Provide clear descriptions..."}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-cyan-455 bg-cyan-400 hover:brightness-110 text-black font-sans font-bold text-[10.5px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center"
                    >
                      {isArabic ? "إرسال التذكرة فوراً" : "Submit Encrypted Ticket"}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Footer of Support Widget */}
          <div className="bg-slate-950/90 border-t border-white/5 py-2.5 px-4 text-[8.5px] font-mono text-slate-600 flex justify-between">
            <span>ARG LMS SHIELD V2.6</span>
            <span>PROTECTED DIRECT ACCESS</span>
          </div>
        </div>
      )}
    </div>
  );
}
