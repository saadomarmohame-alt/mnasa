import { useState, useRef } from 'react';
import { Award, Share2, Printer, ShieldCheck, Sparkles, Download } from 'lucide-react';
import { Certificate } from '../types';

interface InteractiveCertProps {
  certificate: Certificate;
  onClose?: () => void;
}

export default function InteractiveCert({ certificate, onClose }: InteractiveCertProps) {
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://argintini.io/credential/${certificate.credentialId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Printable Frame Area */}
      <div 
        ref={certRef}
        className="relative aspect-[1.414/1] w-full rounded-2xl border-2 border-amber-500/40 bg-slate-950 p-[3%] text-white shadow-2xl overflow-hidden shadow-amber-950/20 group/cert"
      >
        {/* Futuristic glowing mathematical grids and corner brackets */}
        <div className="absolute inset-4 border border-slate-900/45 pointer-events-none rounded-xl" />
        <div className="absolute inset-[3.5%] border border-dashed border-amber-600/10 pointer-events-none rounded-lg" />
        
        {/* Security watermark micro patterns in background */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Golden laser gradients flares */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover/cert:bg-amber-500/10 transition-all duration-1000" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl group-hover/cert:bg-yellow-500/10 transition-all duration-1000" />

        {/* Certificate Border L corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

        {/* Layout Content */}
        <div className="h-full flex flex-col justify-between items-center text-center relative z-10 py-[2%]">
          {/* Header */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
              <span className="text-[9px] md:text-xs font-mono tracking-[0.25em] text-amber-400 font-bold uppercase">AL ARGINTINI Autonomous Blockchain Web Registry</span>
              <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
            </div>
            <h2 className="text-lg md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200">
              CERTIFICATE OF ACHIEVEMENTS
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto" />
          </div>

          {/* Presentation Block */}
          <div className="space-y-2 md:space-y-3">
            <p className="text-[10px] md:text-sm font-sans italic text-slate-400">
              This permanent digital credential certifies that academic weight validation registers
            </p>
            <h1 className="text-xl md:text-3.5xl font-sans font-extrabold text-white uppercase tracking-wide px-3 select-all">
              {certificate.userName}
            </h1>
            <p className="text-[10px] md:text-xs font-sans text-slate-400 max-w-md mx-auto leading-relaxed">
              has successfully decoded all kernel elements, answered all timed MCQs with a graded neural optimization metric of <strong className="text-amber-400 font-mono font-bold">{certificate.score}%</strong>, and completed rigorous coursework requirements in
            </p>
            <h3 className="text-sm md:text-xl font-sans font-extrabold text-amber-200 select-all">
              {certificate.courseTitle}
            </h3>
          </div>

          {/* Signatures & Security holographic Badge */}
          <div className="w-full flex justify-between items-end px-[6%] pt-2">
            {/* Signature 1 */}
            <div className="text-left space-y-1 w-[30%]">
              <span className="block font-serif italic text-xs md:text-sm text-slate-300">Soraya Vance</span>
              <div className="h-[0.5px] bg-slate-700 w-full" />
              <p className="text-[8px] md:text-[10px] font-mono text-slate-500 uppercase tracking-wider">Dean of AI Operations</p>
            </div>

            {/* holographic Rotating Gold Badge */}
            <div className="relative flex flex-col items-center justify-center w-[20%] group">
              <div className="absolute w-12 h-12 md:w-18 md:h-18 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center animate-spin [animation-duration:15s] shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition duration-500" />
              <div className="absolute w-10 h-10 md:w-15 md:h-15 rounded-full border-2 border-dashed border-amber-300/40 bg-transparent animate-spin [animation-duration:8s] -scale-x-100" />
              <Award className="w-6 h-6 md:w-10 md:h-10 text-amber-400 relative z-10 transition-all group-hover:rotate-12 duration-300" />
              {/* security stamps */}
              <span className="text-[7px] font-mono text-amber-500 tracking-widest mt-1 md:mt-2.5">VERIFIED</span>
            </div>

            {/* Signature 2 */}
            <div className="text-right space-y-1 w-[30%]">
              <span className="block font-serif italic text-xs md:text-sm text-slate-300">Sébastien Aurelius</span>
              <div className="h-[0.5px] bg-slate-700 w-full" />
              <p className="text-[8px] md:text-[10px] font-mono text-slate-500 uppercase tracking-wider">CEO Founder</p>
            </div>
          </div>

          {/* Footer Metadata hashes */}
          <div className="w-full border-t border-slate-900/80 pt-1.5 md:pt-2 flex justify-between items-center text-[7px] md:text-[9px] font-mono text-slate-500 px-2">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>SECURITY HASH: {certificate.credentialId}</span>
            </div>
            <div>
              <span>REGISTRY DATE: {certificate.issueDate}</span>
            </div>
            <div className="hidden sm:block">
              <span>DECENTRALIZED SHA-256 ID PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Utility Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/35">
        <div className="space-y-1">
          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Certificate Options
          </h4>
          <p className="text-[10px] text-slate-400 max-w-sm">This is a fully verifiable certificate assets. Share your achievement on LinkedIn, Twitter, or copy the ledger address.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:border-amber-500/30 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5 bg-slate-950/20 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Ledger!' : 'Copy Share Key'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:border-amber-500/30 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5 bg-slate-950/20 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Print</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-755 text-xs font-sans font-medium text-white transition active:scale-95"
            >
              Exit Vault
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
