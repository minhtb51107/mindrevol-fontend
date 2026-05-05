import React from 'react';
import { Facebook, Instagram, Twitter, Github, Mail } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="min-h-[60vh] w-full bg-white dark:bg-[#09090b] flex flex-col items-center justify-between py-20 px-6 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Cột Thương hiệu */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black text-2xl transition-colors">
              M
            </div>
            <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white transition-colors">MINDREVOL</span>
          </div>
          <p className="text-slate-600 dark:text-zinc-500 max-w-sm text-lg leading-relaxed mb-8 transition-colors">
            Nâng tầm trải nghiệm kết nối và lưu giữ kỉ niệm của bạn ngay hôm nay. Sẵn sàng cho những cuộc phiêu lưu mới?
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Instagram} />
            <SocialIcon icon={Twitter} />
            <SocialIcon icon={Github} />
          </div>
        </div>

        {/* Cột Link nhanh */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-slate-900 dark:text-white transition-colors">Khám phá</h4>
          <ul className="space-y-4 text-slate-600 dark:text-zinc-500 transition-colors">
            <li><a href="#home" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Tải ứng dụng</a></li>
            <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Tính năng chính</a></li>
            <li><a href="/app" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Web App</a></li>
            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Blog dự án</a></li>
          </ul>
        </div>

        {/* Cột Hỗ trợ */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-slate-900 dark:text-white transition-colors">Liên hệ</h4>
          <ul className="space-y-4 text-slate-600 dark:text-zinc-500 transition-colors">
            <li className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">
              <Mail className="w-4 h-4" /> support@mindrevol.com
            </li>
            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Chính sách bảo mật</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl w-full pt-20 mt-20 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 dark:text-zinc-600 text-sm transition-colors">
        <p>© 2026 MindRevol Studio. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Hanoi, Vietnam</span>
          <span>Made with ❤️ for Connection</span>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: { icon: any }) => (
  <a href="#" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all text-slate-600 dark:text-zinc-400">
    <Icon className="w-5 h-5" />
  </a>
);