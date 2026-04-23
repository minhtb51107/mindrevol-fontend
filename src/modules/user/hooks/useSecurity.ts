import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { userService } from '../services/user.service';

export const useSecurity = (onClose: () => void) => {
    const { user } = useAuth();
    
    const [otpStep, setOtpStep] = useState<'INIT' | 'VERIFY'>('INIT');
    const [isLoading, setIsLoading] = useState(false);

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetForm = () => {
        setOtpStep('INIT');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setIsLoading(false);
    };

    const handleSendOtp = async () => {
        if (!user?.email) return toast.error("Không tìm thấy email người dùng");
        
        setIsLoading(true);
        try {
            await userService.sendOtp(user.email);
            toast.success(`Mã xác nhận đã được gửi đến ${user.email}`);
            setOtpStep('VERIFY');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gửi mã thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) return toast.error("Mật khẩu xác nhận không khớp");
        if (newPassword.length < 6) return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        if (otp.length < 6) return toast.error("Vui lòng nhập đủ 6 số OTP");

        setIsLoading(true);
        try {
            await userService.updatePasswordWithOtp({ otp, newPassword });
            toast.success("Cập nhật mật khẩu thành công!");
            resetForm();
            onClose(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại. Vui lòng kiểm tra lại mã OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (otpStep === 'VERIFY') setOtpStep('INIT');
        else onClose();
    };

    return {
        user, otpStep, isLoading,
        otp, setOtp, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
        handleSendOtp, handleSubmit, handleBack, resetForm
    };
};