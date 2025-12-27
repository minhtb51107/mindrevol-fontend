import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthFlow } from '../store/AuthFlowContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';

// --- CONFIG ---
const FACEBOOK_APP_ID = "1578813576625180"; 

// Vẫn dùng Key Sandbox (vì app chưa được duyệt Production)
const TIKTOK_CLIENT_KEY = "sbawuq6944l3tftyri"; 

// [QUAN TRỌNG]: Đổi sang link Vercel
const TIKTOK_REDIRECT_URI = "https://mindrevol.vercel.app/auth/callback/tiktok";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const EmailForm = () => {
  const { submitEmail, isLoading, error, setError, loginGoogle, loginFacebook } = useAuthFlow();
  
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(schema)
  });

  // Google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginGoogle(tokenResponse.access_token);
    },
    onError: () => setError("Đăng nhập Google thất bại"),
  });

  // Facebook
  const handleFacebookSuccess = async (response: any) => {
    if (response.accessToken) {
      await loginFacebook(response.accessToken);
    }
  };

  // TikTok
// TikTok
const handleTikTokLogin = async () => {
    // Tạo PKCE
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('tiktok_code_verifier', codeVerifier);

    // [TEST]: Gán cứng giá trị để loại trừ mọi lỗi do biến môi trường
    // Nếu đoạn này chạy được, lỗi nằm ở file .env của bạn
    const HARDCODED_CLIENT_KEY = "sbawuq6944l3tftyri"; 
    const HARDCODED_REDIRECT_URI = "https://mindrevol.vercel.app/";

    console.log("URL đang gửi đi TikTok:", { 
        key: HARDCODED_CLIENT_KEY, 
        uri: HARDCODED_REDIRECT_URI 
    });

    const targetUrl = 'https://www.tiktok.com/v2/auth/authorize/';
    const params = new URLSearchParams({
        client_key: HARDCODED_CLIENT_KEY, // Dùng biến cứng
        scope: 'user.info.basic',
        response_type: 'code',
        redirect_uri: HARDCODED_REDIRECT_URI, // Dùng biến cứng
        state: Math.random().toString(36).substring(7),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    });

    // In ra URL cuối cùng để bạn copy paste kiểm tra
    console.log("FULL URL:", `${targetUrl}?${params.toString()}`);

    window.location.href = `${targetUrl}?${params.toString()}`;
};

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit((d) => submitEmail(d.email))} className="space-y-4">
        <Input 
          {...register('email')} 
          label="Email"
          placeholder="name@example.com" 
          autoFocus 
          error={errors.email?.message}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        
        <Button type="submit" isLoading={isLoading} className="w-full text-base font-bold shadow-none">
          Tiếp tục
        </Button>
      </form>

      {/* --- DIVIDER --- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
          <span className="bg-[#050505] px-3 text-zinc-600">Hoặc tiếp tục với</span>
        </div>
      </div>

      {/* --- VERTICAL BUTTON STACK --- */}
      <div className="space-y-3">
        
        {/* 1. Google Button */}
        <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleGoogleLogin()} 
            className="w-full bg-[#18181b] border-zinc-800 text-white hover:bg-zinc-800 hover:text-white justify-start pl-4 font-medium h-12 relative"
            isLoading={isLoading} 
        >
          {!isLoading && (
            <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
          )}
          <span className="flex-1 text-center pr-8">Google</span>
        </Button>

        {/* 2. Facebook Button */}
        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          onSuccess={handleFacebookSuccess}
          onFail={(error) => console.log('FB Login Failed!', error)}
          scope="email,public_profile" 
          render={({ onClick }) => (
            <Button 
                variant="outline" 
                type="button" 
                onClick={isLoading ? undefined : onClick}
                className="w-full bg-[#18181b] border-zinc-800 text-white hover:bg-zinc-800 hover:text-white justify-start pl-4 font-medium h-12 relative"
                isLoading={isLoading}
            >
               {!isLoading && (
                   <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-1.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                        <path d="M16.539 15.292l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.745s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.645H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.664z" fill="#FFFFFF"/>
                   </svg>
               )}
               <span className="flex-1 text-center pr-8">Facebook</span>
            </Button>
          )}
        />

        {/* 3. TikTok Button */}
        <Button 
            variant="outline" 
            type="button" 
            onClick={handleTikTokLogin}
            className="w-full bg-[#18181b] border-zinc-800 text-white hover:bg-zinc-800 hover:text-white justify-start pl-4 font-medium h-12 relative"
            isLoading={isLoading}
        >
            {!isLoading && (
               <svg className="w-5 h-5 mr-3 shrink-0" viewBox="0 0 24 24" fill="#FFFFFF">
                   <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.637 6.329 6.329 0 0 0 10.857-4.424V8.66c1.654.625 3.4.14 4.77 1.516V6.686z"/>
               </svg>
            )}
            <span className="flex-1 text-center pr-8">TikTok</span>
        </Button>
      </div>
    </motion.div>
  );
};