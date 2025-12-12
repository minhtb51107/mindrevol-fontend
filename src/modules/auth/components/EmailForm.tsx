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

// Import hàm PKCE
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/pkce';

// --- CONFIG ---
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY;
const TIKTOK_REDIRECT_URI = import.meta.env.VITE_TIKTOK_REDIRECT_URI;
// -------------

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const EmailForm = () => {
  const { submitEmail, isLoading, error, setError, loginGoogle, loginFacebook } = useAuthFlow();
  
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(schema)
  });

  // 1. Google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginGoogle(tokenResponse.access_token);
    },
    onError: () => setError("Đăng nhập Google thất bại"),
  });

  // 2. Facebook
  const handleFacebookSuccess = async (response: any) => {
    if (response.accessToken) {
      await loginFacebook(response.accessToken);
    }
  };

  // 3. TikTok Handle (CÓ PKCE)
  const handleTikTokLogin = async () => {
    const csrfState = Math.random().toString(36).substring(7);
    
    // a. Sinh Verifier và Challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // b. Lưu Verifier vào Storage để lát nữa dùng ở trang Callback
    localStorage.setItem('tiktok_code_verifier', codeVerifier);
    
    // c. Tạo URL kèm code_challenge
    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    url += `?client_key=${TIKTOK_CLIENT_KEY}`;
    url += `&scope=user.info.basic`;
    url += `&response_type=code`;
    url += `&redirect_uri=${TIKTOK_REDIRECT_URI}`;
    url += `&state=${csrfState}`;
    url += `&code_challenge=${codeChallenge}`; // <--- QUAN TRỌNG
    url += `&code_challenge_method=S256`;      // <--- QUAN TRỌNG
    
    window.location.href = url;
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
        {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
        <Button type="submit" isLoading={isLoading}>Tiếp tục</Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted">Hoặc</span></div>
      </div>

      <div className="space-y-3">
        {/* Nút Google */}
        <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleGoogleLogin()} 
            className="relative w-full"
            isLoading={isLoading} 
        >
          {!isLoading && (
             <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
          )}
          Tiếp tục với Google
        </Button>

        {/* Nút Facebook */}
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
                className="relative w-full"
                isLoading={isLoading}
            >
               {!isLoading && (
                   <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-6.363 6.291-6.363 1.209 0 2.712.084 3.013.125v3.457l-2.118.001c-1.922 0-2.296 1.171-2.296 2.627v1.733h4.697l-1.123 3.667h-3.574v7.977C20.686 22.114 24 17.472 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.472 3.314 10.114 7.892 11.691z"/>
                   </svg>
               )}
               Tiếp tục với Facebook
            </Button>
          )}
        />

        {/* Nút TikTok */}
        <Button 
            variant="outline" 
            type="button" 
            onClick={handleTikTokLogin}
            className="relative w-full"
            isLoading={isLoading}
        >
            {!isLoading && (
               <svg className="w-5 h-5 mr-2 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
               </svg>
            )}
            Tiếp tục với TikTok
        </Button>
      </div>
    </motion.div>
  );
};