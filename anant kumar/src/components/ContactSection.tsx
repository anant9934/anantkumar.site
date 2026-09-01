import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  playPop,
  playSuccess,
  playClick,
  playError,
} from '@/hooks/useSoundEffects';
import SectionBlock from './SectionBlock';
import { ScrollReveal } from './ui/ScrollReveal';
import {
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  BookOpen,
  Send,
  LucideGlobe2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  blog: BookOpen,
};

const contactSocials = SOCIAL_LINKS.filter((l) => l.id !== 'email');

// Availability Categories requested by user
const AVAILABILITY_STATUSES = [
  { id: 'projects', label: 'Projects', tag: 'AVAILABLE_FOR_PROJECTS', starter: "Hi Anant, I'd like to discuss a project collaboration for..." },
  { id: 'research', label: 'Research', tag: 'AVAILABLE_FOR_RESEARCH', starter: "Hi Anant, I'm interested in collaborating on research in AI/ML & systems..." },
  { id: 'freelancing', label: 'Freelancing', tag: 'AVAILABLE_FOR_FREELANCING', starter: "Hi Anant, we have a freelance engineering opportunity for..." },
  { id: 'partnership', label: 'Partnership', tag: 'AVAILABLE_FOR_PARTNERSHIP', starter: "Hi Anant, I would like to explore a partnership opportunity with..." },
  { id: 'collaboration', label: 'Collaboration', tag: 'AVAILABLE_FOR_COLLABORATION', starter: "Hi Anant, let's connect and collaborate on..." },
] as const;

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  category: z.string().optional(),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('projects');
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const RATE_LIMIT_MS = 30_000; // 30 seconds between submissions
  const RATE_LIMIT_KEY = 'contact_last_submit';

  // Cycle through availability statuses smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % AVAILABILITY_STATUSES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const formspreeId = (
    (import.meta.env.VITE_FORMSPREE_ID as string) ||
    PROFILE.formspreeId ||
    'mnpqprvw'
  ).trim();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: 'Projects',
      message: '',
    },
  });

  const messageValue = watch('message') || '';
  const messageLength = messageValue.length;
  const MAX_MESSAGE_LENGTH = 1000;

  // Handle clicking an availability badge
  const handleBadgeClick = (statusObj: (typeof AVAILABILITY_STATUSES)[number]) => {
    playPop();
    setActiveCategory(statusObj.id);
    setValue('category', statusObj.label);
    if (!messageValue || AVAILABILITY_STATUSES.some((s) => s.starter === messageValue)) {
      setValue('message', statusObj.starter);
    }
    messageInputRef.current?.focus();
    toast.info(`Selected: ${statusObj.label} inquiry`, { duration: 1500 });
  };

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);

    // ── Security: Honeypot check ──
    if (honeypot) {
      await new Promise((r) => setTimeout(r, 1000));
      setIsSubmitted(true);
      return;
    }

    // ── Security: Rate limiting ──
    const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
    const now = Date.now();
    const elapsed = now - lastSubmit;
    if (elapsed < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      setRateLimited(true);
      setCooldownSeconds(remaining);
      const countdown = setInterval(() => {
        setCooldownSeconds((s) => {
          if (s <= 1) {
            clearInterval(countdown);
            setRateLimited(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      toast.error(`Please wait ${remaining}s before sending another message.`);
      return;
    }

    localStorage.setItem(RATE_LIMIT_KEY, String(now));

    try {
      const targetUrl = formspreeId.startsWith('http')
        ? formspreeId
        : `https://formspree.io/f/${formspreeId}`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          category: data.category || activeCategory,
          message: data.message,
          _subject: `[Portfolio Inquiry] ${data.category || 'General'} from ${data.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send via server. You can also email 720anant@gmail.com directly.');
      }

      // Success sequence
      playSuccess();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#000000', '#FACC15', '#10B981', '#3B82F6', '#EF4444'],
      });
      setIsSubmitted(true);
      toast.success('Your message has been sent directly to Anant!');
    } catch (err) {
      playError();
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please check your connection or reach out at 720anant@gmail.com.';
      setSubmitError(message);
      toast.error(message);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    playPop();
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const { ref: registerMessageRef, ...messageRest } = register('message');

  return (
    <SectionBlock id="contact" title="Get in touch">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Left Column: Contact Info & Status */}
        <ScrollReveal animation="fade-in" className="space-y-6 md:space-y-8">
          <p className="text-foreground/80 leading-relaxed font-light text-lg">
            I'm actively available for <strong>high-impact projects, AI/ML research, freelance engineering, partnerships, and collaborations</strong>.
            Whether you want to build something ambitious or just connect, drop a message below.
          </p>

          <div className="space-y-4">
            {/* Email Card */}
            <div className="group flex items-center justify-between gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 bg-black text-white rounded-none shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-foreground/50 mb-0.5">
                    Direct Email
                  </p>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="font-mono text-sm font-bold hover:underline break-all text-black"
                  >
                    {PROFILE.email}
                  </a>
                </div>
              </div>
              <button
                onClick={copyEmail}
                className="p-2.5 border-2 border-black bg-zinc-100 hover:bg-black hover:text-white rounded-none transition-colors shrink-0"
                title="Copy email address"
                aria-label={copied ? 'Email copied' : 'Copy email address'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Current Status — Dynamic Interactive Availability Card */}
            <div className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 rounded-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-black text-white rounded-none">
                    <LucideGlobe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-foreground/50">
                      CURRENT STATUS
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-mono text-xs font-black text-emerald-700 tracking-wider">
                        OPEN FOR WORK
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Status Cycling Tag */}
                <div className="hidden sm:block">
                  <span className="font-mono text-[11px] font-black px-2.5 py-1 bg-black text-yellow-400 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {AVAILABILITY_STATUSES[statusIndex].tag}
                  </span>
                </div>
              </div>

              {/* Clickable Multi-Availability Tags */}
              <div className="pt-2 border-t border-black/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 mb-2 flex items-center gap-1">
                  <Sparkles size={11} className="text-yellow-600" /> Click to auto-select inquiry type:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABILITY_STATUSES.map((status) => {
                    const isSelected = activeCategory === status.id;
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => handleBadgeClick(status)}
                        className={`font-mono text-[11px] font-bold px-2.5 py-1 border-2 transition-all duration-150 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                            : 'bg-zinc-50 text-black border-black/30 hover:border-black hover:bg-black hover:text-white'
                        }`}
                      >
                        <span className="text-[10px]">{isSelected ? '✓' : '+'}</span>
                        <span>{status.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <p className="text-xs uppercase font-mono tracking-widest text-foreground/50 mb-3">
              Social Profiles & Channels
            </p>
            <div className="flex flex-wrap gap-3">
              {contactSocials.map((link) => {
                const Icon = ICON_MAP[link.id];
                if (!Icon) return null;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    aria-label={link.label}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-black bg-white font-mono text-xs font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white transition-all duration-150 rounded-none"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: Interactive Form or Success State */}
        <ScrollReveal animation="fade-up" delay={0.2} className="w-full">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 animate-fade-in min-h-[440px] rounded-none">
              <div className="p-4 bg-black border-2 border-black rounded-none text-yellow-400">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="font-mono text-2xl font-black uppercase tracking-wider text-black">
                Message Sent Successfully!
              </h3>
              <p className="text-sm font-mono text-foreground/80 leading-relaxed max-w-sm">
                Thank you for reaching out, <strong>{getValues('name')}</strong>! Your message regarding{' '}
                <strong>{getValues('category') || 'your inquiry'}</strong> has been delivered to Anant's inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    playClick();
                    setIsSubmitted(false);
                    reset();
                  }}
                  className="px-6 py-3 border-2 border-black bg-black text-white font-mono uppercase text-xs tracking-widest font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:text-black transition-all duration-150 rounded-none"
                >
                  Send Another Message
                </button>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="px-6 py-3 border-2 border-black bg-white text-black font-mono uppercase text-xs tracking-widest font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white transition-all duration-150 rounded-none flex items-center justify-center gap-1.5"
                >
                  <span>Open in Mail</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit, () => playError())}
              className="p-6 md:p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5 rounded-none font-mono"
              noValidate
            >
              {/* Honeypot field for bot spam protection */}
              <div aria-hidden="true" className="absolute -z-50 opacity-0 h-0 overflow-hidden" tabIndex={-1}>
                <input
                  type="text"
                  name="_gotcha"
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                />
              </div>

              {submitError && (
                <div className="flex items-start gap-3 p-3.5 bg-red-50 border-2 border-red-500 text-red-700 text-xs rounded-none">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">Submission Notice</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="contact-name" className="block text-[11px] font-black uppercase tracking-wider text-black mb-1.5">
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  {...register('name')}
                  className={`w-full bg-white border-2 ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-black focus:border-black'
                  } px-3.5 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none`}
                />
                {errors.name && (
                  <p className="mt-1 font-mono text-[11px] text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="contact-email" className="block text-[11px] font-black uppercase tracking-wider text-black mb-1.5">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className={`w-full bg-white border-2 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-black focus:border-black'
                  } px-3.5 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none`}
                />
                {errors.email && (
                  <p className="mt-1 font-mono text-[11px] text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="contact-message" className="text-[11px] font-black uppercase tracking-wider text-black">
                    Your Message *
                  </label>
                  <span className={`text-[10px] ${messageLength >= MAX_MESSAGE_LENGTH ? 'text-red-600 font-bold' : 'text-zinc-500'}`}>
                    {messageLength} / {MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell me about your project, idea, research topic, or inquiry..."
                  maxLength={MAX_MESSAGE_LENGTH}
                  {...messageRest}
                  ref={(e) => {
                    registerMessageRef(e);
                    messageInputRef.current = e;
                  }}
                  className={`w-full bg-white border-2 ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-black focus:border-black'
                  } px-3.5 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all resize-none rounded-none`}
                />
                {errors.message && (
                  <p className="mt-1 font-mono text-[11px] text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || rateLimited}
                  onClick={playClick}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-black text-white font-mono uppercase tracking-widest text-xs font-black border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-zinc-900 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed rounded-none"
                >
                  {isSubmitting ? (
                    <>
                      <span>Sending Message...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : rateLimited ? (
                    <>
                      <span>Please wait {cooldownSeconds}s</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </ScrollReveal>
      </div>
    </SectionBlock>
  );
};

export default ContactSection;
