import React, { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { X, Lock, KeyRound } from 'lucide-react';

export const SecurityModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userService.hasPassword().then(setHasPassword);
  }, []);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) return alert("Mật khẩu nhập lại không khớp!");
    if (newPassword.length < 8) return alert("Mật khẩu phải từ 8 ký tự.");

    setLoading(true);
    try {
      if (hasPassword) {
        await userService.changePassword({ oldPassword, newPassword });
        alert("Đổi mật khẩu thành công!");
      } else {
        await userService.createPassword(newPassword);
        alert("Tạo mật khẩu thành công!");
        setHasPassword(true);
      }
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPassword === null) return null; // Loading state

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-zinc-900 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Lock size={20} className="text-yellow-500"/>
            {hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu'}
          </h3>
          <button onClick={onClose}><X className="text-zinc-400" /></button>
        </div>

        <div className="space-y-4">
          {!hasPassword && (
            <p className="text-sm text-zinc-400 bg-zinc-800 p-3 rounded-lg mb-4">
              Bạn đang dùng tài khoản Mạng xã hội. Hãy tạo mật khẩu để có thể đăng nhập bằng Email.
            </p>
          )}

          {hasPassword && (
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                className="w-full bg-zinc-800 p-3 rounded-xl mt-1 text-white"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs text-zinc-500 font-bold uppercase">Mật khẩu mới</label>
            <input 
              type="password" 
              className="w-full bg-zinc-800 p-3 rounded-xl mt-1 text-white"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 font-bold uppercase">Nhập lại mật khẩu mới</label>
            <input 
              type="password" 
              className="w-full bg-zinc-800 p-3 rounded-xl mt-1 text-white"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl mt-4 hover:bg-yellow-400 transition"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};