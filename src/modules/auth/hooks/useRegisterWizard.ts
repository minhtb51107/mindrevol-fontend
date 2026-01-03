import { useState } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { StepBasicInfoValues } from '../schemas/auth.schema';

type RegisterStep = 1 | 2 | 3;

export const useRegisterWizard = () => {
  const { updateRegisterData, register, isLoading, resetFlow, email, error } = useAuthFlow();
  const [step, setStep] = useState<RegisterStep>(1);

  // Xử lý xong Step 1
  const handlePasswordSubmit = (password: string) => {
    updateRegisterData({ password });
    setStep(2);
  };

  // Xử lý xong Step 2
  const handleInfoSubmit = (data: StepBasicInfoValues) => {
    updateRegisterData(data);
    setStep(3);
  };

  // Xử lý xong Step 3 (Hoàn tất)
  const handleHandleSubmit = async (handle: string) => {
    await register({ handle });
  };

  return {
    step,
    setStep,
    email,
    error,
    isLoading,
    resetFlow,
    handlers: {
      onPasswordSubmit: handlePasswordSubmit,
      onInfoSubmit: handleInfoSubmit,
      onHandleSubmit: handleHandleSubmit
    }
  };
};