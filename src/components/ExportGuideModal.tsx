import React, { useState } from 'react';
import { X, Copy, Check, Github, Cloud, Terminal, ExternalLink, Globe } from 'lucide-react';

interface ExportGuideModalProps {
  onClose: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                GitHub ও Cloudflare Pages এ ফ্রি হোস্টিং গাইড
              </h2>
              <p className="text-xs text-slate-400">
                Export & Publish this 3D Web Game 100% Free Forever
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Step 1: Export files */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> ধাপ ১: প্রোজেক্ট ডাউনলোড ও গিট রেপো প্রস্তুত (Git Init)
              </span>
              <button
                type="button"
                onClick={() =>
                  copyCode(
                    'git init\ngit add .\ngit commit -m "Initial Dhaka Traffic Rush 3D game"\ngit branch -M main',
                    1
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-slate-200 overflow-x-auto">
{`git init
git add .
git commit -m "Initial Dhaka Traffic Rush 3D game"
git branch -M main`}
            </pre>
          </div>

          {/* Step 2: Push to GitHub */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Github className="w-4 h-4" /> ধাপ ২: GitHub এ নতুন রিপোজিটরিতে পুশ (Push to GitHub)
              </span>
              <button
                type="button"
                onClick={() =>
                  copyCode(
                    'git remote add origin https://github.com/YOUR_USERNAME/dhaka-traffic-rush.git\ngit push -u origin main',
                    2
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              GitHub এ একটি নতুন Public/Private রিপোজিটরি তৈরি করুন এবং নিচের কমান্ড রান করুন:
            </p>
            <pre className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-slate-200 overflow-x-auto">
{`git remote add origin https://github.com/YOUR_USERNAME/dhaka-traffic-rush.git
git push -u origin main`}
            </pre>
          </div>

          {/* Step 3: Cloudflare Pages Setup */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <Cloud className="w-4 h-4" /> ধাপ ৩: Cloudflare Pages এ এক ক্লিকে লাইভ করুন (Free Deploy)
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
              <li>
                <a
                  href="https://dash.cloudflare.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline inline-flex items-center gap-0.5"
                >
                  Cloudflare Dashboard <ExternalLink className="w-3 h-3" />
                </a>{' '}
                লগইন করুন।
              </li>
              <li>বাম পাশের মেনু থেকে <strong>Workers & Pages</strong> &gt; <strong>Create Application</strong> &gt; <strong>Pages</strong> এ যান।</li>
              <li><strong>Connect to Git</strong> ক্লিক করে আপনার GitHub রিপোজিটরিটি সিলেক্ট করুন।</li>
              <li>বিল্ড সেটিংস কনফিগার করুন:</li>
            </ol>

            <div className="mt-2.5 bg-slate-900 p-2.5 rounded-xl text-[11px] font-mono text-emerald-300 border border-slate-800 space-y-1">
              <div>Framework preset: <strong>Vite</strong></div>
              <div>Build command: <strong>npm run build</strong></div>
              <div>Build output directory: <strong>dist</strong></div>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              ৫. <strong>Save and Deploy</strong> চাপলেই ৩০ সেকেন্ডের মধ্যে আপনার গেম একটি ফ্রি <code className="text-amber-400 font-mono">*.pages.dev</code> সাবডোমেইনে আনলিমিটেড ব্যান্ডউইথ সহ সারাবিশ্বে লাইভ হয়ে যাবে!
            </p>
          </div>

          {/* Step 4: Google Chrome Search Optimization for দাদার রাস্তা */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-amber-500/60">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
              <Globe className="w-4 h-4 text-amber-400" /> ধাপ ৪: শুধু 'দাদার রাস্তা' সার্চ দিলেই গুগল ও ক্রোমে গেমটি পাওয়ার উপায় (Google SEO Indexing)
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                গেমটির কোডে ইতিমধ্যে <strong>Schema.org VideoGame</strong> ও <strong>"দাদার রাস্তা"</strong> কিওয়ার্ড সেট করা হয়েছে। গুগলে সবার আগে ইনডেক্স করাতে:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                <li>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 underline font-semibold inline-flex items-center gap-1"
                  >
                    Google Search Console <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  এ গিয়ে আপনার লাইভ সাইটের লিংকটি (যেমন <code className="text-amber-300 font-mono">https://dadar-rasta.pages.dev</code>) পেস্ট করুন।
                </li>
                <li>উপরে সার্চ বারে লিংকটি দিয়ে <strong>URL Inspection</strong> করুন এবং <strong>"Request Indexing"</strong> বাটনে ক্লিক করুন।</li>
                <li>গুগল ক্রলার ১২-২৪ ঘণ্টার মধ্যে সাইটটি ক্রল করবে এবং গুগল ক্রোমে <strong>"দাদার রাস্তা"</strong> লিখে সার্চ দিলে আপনার গেম সরাসরি রেজাল্টে সবার উপরে চলে আসবে!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer"
          >
            বুঝেছি, খেলাতে ফিরুন
          </button>
        </div>
      </div>
    </div>
  );
};
