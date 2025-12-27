import React, { useState, useRef } from 'react';
import { UserProfile, userService } from '../services/user.service';
import { X, Camera, Save } from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  const { refreshProfile } = useAuth();
  const [fullname, setFullname] = useState(user.fullname);
  const [bio, setBio] = useState(user.bio || '');
  // const [gender, setGender] = useState(user.gender || 'OTHER'); // Nếu UserProfile có field gender
  // const [dob, setDob] = useState(user.dateOfBirth || '');       // Nếu UserProfile có field dateOfBirth
  
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreviewAvatar(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await userService.updateProfile({
        fullname,
        bio,
        avatar: file || undefined,
        // gender: gender,
        // dateOfBirth: dob
      });
      await refreshProfile(); // Refresh context
      onUpdateSuccess();
      onClose();
    } catch (error) {
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-zinc-800">
          <h3 className="text-white font-bold text-lg">Chỉnh sửa hồ sơ</h3>
          <button onClick={onClose}><X className="text-zinc-400" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700">
                <img src={previewAvatar || user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera className="text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Họ và tên</label>
              <input 
                value={fullname} 
                onChange={e => setFullname(e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-yellow-500" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Tiểu sử (Bio)</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full bg-zinc-800 text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-yellow-500 resize-none" 
              />
            </div>

            {/* Thêm DatePicker / Gender Select ở đây nếu cần */}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl flex items-center justify-center hover:bg-yellow-400 transition"
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};