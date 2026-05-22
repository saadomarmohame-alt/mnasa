import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle, Image, Globe, ChevronDown, Send, 
  Smile, Plus, Star, Layers, HelpCircle, FileText, Film, Eye 
} from 'lucide-react';
import { Course, CourseSection } from '../types';

interface SocialCourseComposerProps {
  instructorName: string;
  instructorAvatar: string;
  instructorBio?: string;
  onPostCreated: (course: Course) => void;
}

const PRESET_THUMBNAILS = [
  { id: 't1', label: 'Quantum Matrix', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80' },
  { id: 't2', label: 'Cyber Terminal', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
  { id: 't3', label: 'Luxury Blueprint', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { id: 't4', label: 'Optical Node', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
  { id: 't5', label: 'Silicon Architecture', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' }
];

export default function SocialCourseComposer({ 
  instructorName, 
  instructorAvatar, 
  instructorBio = "AL ARGINTINI Certified Instructor Node", 
  onPostCreated 
}: SocialCourseComposerProps) {
  // Post/Course state
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [category, setCategory] = useState('AI');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [price, setPrice] = useState(250);
  const [originalPrice, setOriginalPrice] = useState(499);
  const [description, setDescription] = useState('');
  const [arabicDescription, setArabicDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('Expert Live mentoring, Verifiable Blockchain Diploma, Modern Projects');
  const [selectedThumb, setSelectedThumb] = useState(PRESET_THUMBNAILS[0].url);
  const [customThumbUrl, setCustomThumbUrl] = useState('');
  
  // Quick core curriculum attachment
  const [sectionTitle, setSectionTitle] = useState('Introductory Material Core');
  const [lessonTitle, setLessonTitle] = useState('Dynamic Syllabus Introduction Walkthrough');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  const [composerSuccess, setComposerSuccess] = useState(false);
  const [pricingError, setPricingError] = useState('');

  const finalThumbnail = customThumbUrl.trim() || selectedThumb;

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Strict validation: price must be between 50 and 500 (EGP pounds)
    if (price < 50 || price > 500) {
      setPricingError('Course price must be between 50 EGP and 500 EGP as per Argentina Quality Standards!');
      return;
    }
    setPricingError('');

    // Build the dynamic Course object as requested
    const generatedId = `course-posted-${Date.now()}`;
    
    const featuresList = featuresText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newCoursePost: Course = {
      id: generatedId,
      title: title.trim(),
      arabicTitle: arabicTitle.trim() || `برنامج: ${title.trim()}`,
      description: description.trim(),
      arabicDescription: arabicDescription.trim() || `وصف الدورة التدريبية لـ: ${title.trim()}`,
      category,
      difficulty,
      duration: '12h 30m',
      rating: 5.0,
      reviewsCount: 0,
      enrolledCount: 0,
      price: Number(price) || 250,
      originalPrice: Number(originalPrice) || Number(price) || 499,
      thumbnail: finalThumbnail,
      instructorName,
      instructorAvatar,
      instructorBio,
      isDynamicUpload: true,
      features: featuresList,
      sections: [
        {
          id: `sec-posted-${Date.now()}`,
          title: sectionTitle.trim() || 'Fundamentals Syllabus',
          lessons: [
            {
              id: `les-posted-1-${Date.now()}`,
              title: lessonTitle.trim() || 'Dynamic Video Presentation',
              duration: '15:00',
              videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              isPremium: false,
              codeSnippet: `// Self-generated sandbox code for lessons\nconsole.log("Welcome to ${title.trim()} compiled node!");`
            }
          ]
        }
      ],
      reviews: []
    };

    onPostCreated(newCoursePost);
    setComposerSuccess(true);
    
    // Reset inputs
    setTitle('');
    setArabicTitle('');
    setDescription('');
    setArabicDescription('');
    setCustomThumbUrl('');
    setFeaturesText('Expert Live mentoring, Verifiable Blockchain Diploma, Modern Projects');
    
    setTimeout(() => {
      setComposerSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl space-y-4 max-w-2xl mx-auto" id="social-composer-widget">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-sans font-bold text-white uppercase tracking-wider">Compose Curriculum Post</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">SOCIAL PUBLISHING NODE ACTIVATED</span>
      </div>

      {composerSuccess && (
        <div className="mx-4 p-4 bg-emerald-950/45 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs space-y-1 animate-in zoom-in-95 leading-relaxed">
          <div className="flex items-center gap-2 font-bold uppercase text-[10.5px]">
            <CheckCircle className="w-5.5 h-5.5 stroke-[2.5]" />
            <span>Course Post Published!</span>
          </div>
          <p className="pl-7 font-sans">
            Your custom curriculum post was uploaded successfully to the persistent network database. Dynamic deployment completes instantly in under 20ms. It is now active for all student catalogs!
          </p>
        </div>
      )}

      <form onSubmit={handlePublishPost} className="p-4 space-y-4">
        {/* Author header profile */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-900/40">
          <div className="flex items-center gap-3">
            <img 
              src={instructorAvatar} 
              className="w-10 h-10 rounded-full border border-slate-800 object-cover" 
              alt={instructorName} 
            />
            <div>
              <p className="text-xs font-bold text-white font-sans">{instructorName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/20 px-1.5 py-0.2 rounded border border-cyan-500/10 uppercase">
                  ACTIVE TEACHER Node
                </span>
                <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                  <Globe className="w-2.5 h-2.5" /> Public catalog
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">DISCIPLINE:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs px-2.5 py-1 focus:outline-none"
            >
              <option value="AI">AI & Networks</option>
              <option value="Cybersecurity">Cyber Incident Shield</option>
              <option value="Ethical Hacking">Kernel Ethical Hack</option>
              <option value="Web Development">Fullstack Web Engineering</option>
            </select>
          </div>
        </div>

        {/* Central Composer Textarea Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase block">What is your course post caption & description?</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce this masterclass just like a Facebook narrative or Instagram post caption... Explain what graduates will master! (Include PyTorch, assembly or custom libraries)"
            className="w-full bg-slate-900/30 border border-slate-900 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block">ARABIC DESCRIPTION (LTL ARABIC TIMELINE)</label>
              <textarea
                dir="rtl"
                rows={2}
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                placeholder="أدخل وصف المنهج باللغة العربية هنا لمستخدمي المنصة..."
                className="w-full bg-slate-900/30 border border-slate-900 rounded-xl p-3.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Post Title & Arabic Version</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title (e.g. PyTorch Quantum Agents)"
                className="w-full bg-slate-900 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                placeholder="العنوان باللغة العربية"
                className="w-full bg-slate-900 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white text-right focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Dynamic media picker block */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-mono text-slate-500 uppercase block flex items-center gap-1">
            <Image className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Course Cover Artwork / Photo Attachment</span>
          </label>
          
          <div className="grid grid-cols-5 gap-2">
            {PRESET_THUMBNAILS.map(thumb => {
              const isActive = selectedThumb === thumb.url && !customThumbUrl;
              return (
                <button
                  type="button"
                  key={thumb.id}
                  onClick={() => {
                    setSelectedThumb(thumb.url);
                    setCustomThumbUrl('');
                  }}
                  className={`relative h-12 rounded-xl overflow-hidden border transition cursor-pointer ${isActive ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-900 hover:border-slate-700'}`}
                >
                  <img src={thumb.url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8.5px] font-sans font-bold text-white text-center p-1 leading-none shadow-inner">
                    {thumb.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <input
              type="url"
              value={customThumbUrl}
              onChange={(e) => setCustomThumbUrl(e.target.value)}
              placeholder="Or paste custom image Unsplash URL link directly here..."
              className="w-full bg-slate-900 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Price Tagging & Difficulty */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-900/80">
            <div>
              <label className="text-[9px] font-mono text-indigo-404 text-indigo-400 uppercase block mb-1">PROMO PRICE (50 - 500 EGP)</label>
              <input
                type="number"
                min={50}
                max={500}
                required
                value={price}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setPrice(val);
                  if (val < 50 || val > 500) {
                    setPricingError('Argentina Academy Standard: Price must be strictly between 50 EGP and 500 EGP!');
                  } else {
                    setPricingError('');
                  }
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[8px] text-slate-500 font-mono block mt-0.5">
                ≈ {Math.round(price / 13.3)} SAR | ${Math.round(price / 50)} USD
              </span>
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">STRIKE PRICE (EGP)</label>
              <input
                type="number"
                min={50}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-500 font-mono line-through focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">DIFF LEVEL</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-cyan-400 font-bold focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {pricingError && (
            <p className="text-[10px] text-rose-400 font-mono bg-rose-950/25 px-3 py-1.5 rounded-lg border border-rose-900/50">
              ⚠️ {pricingError}
            </p>
          )}

          <div>
            <label className="text-[9px] font-mono text-cyan-400 uppercase block mb-1">
              Course Features / مميزات الدورة (Comma Separated List)
            </label>
            <input
              type="text"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="e.g. 1-to-1 Live Review, Blockchain Credentials, 4 premium projects"
              className="w-full bg-slate-900 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Initial lecture outline embedded layout */}
        <div className="border border-slate-900 p-3.5 rounded-xl bg-slate-900/10 space-y-3">
          <div className="flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono uppercase text-slate-400">Embed First Lesson Attachment (Social Media Video)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Section Title</label>
              <input
                type="text"
                required
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-white"
              />
            </div>
            
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Video Lesson Title</label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit publisher buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 select-none">
          <p className="text-[10px] text-slate-500 leading-normal font-sans pr-4">
            *Uploading dynamic posts automatically indexes courses instantly to students dashboard with premium certificate tracking enabled. No code recompiles needed.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-bold text-xs tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Send className="w-3.5 h-3.5" /> Publish Live Post
          </button>
        </div>
      </form>
    </div>
  );
}
