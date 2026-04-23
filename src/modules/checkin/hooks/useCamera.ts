import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';

interface UseCameraProps {
    onCapture: (file: File) => void;
}

const base64ToFile = async (base64Url: string, filename: string): Promise<File> => {
    const res = await fetch(base64Url);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
};

const getSupportedVideoMimeType = () => {
    const types = ['video/webm', 'video/mp4', 'video/webm;codecs=vp8', 'video/webm;codecs=daala', 'video/webm;codecs=h264', 'video/mpeg'];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
};

export const useCamera = ({ onCapture }: UseCameraProps) => {
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); 
    const [isCapturing, setIsCapturing] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordProgress, setRecordProgress] = useState(0);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const MAX_RECORD_DURATION = 3000; 

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) clearInterval(holdTimerRef.current);
            if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const handleCapturePhoto = useCallback(async () => {
        if (webcamRef.current) {
            setIsCapturing(true);
            const imageSrc = webcamRef.current.getScreenshot();
            
            if (imageSrc) {
                setTimeout(async () => {
                    try {
                        const fileName = `mindrevol-cam-${Date.now()}.jpg`;
                        const file = await base64ToFile(imageSrc, fileName);
                        onCapture(file); 
                    } catch (error) {
                        toast.error("Lỗi xử lý ảnh chụp");
                    } finally {
                        setIsCapturing(false);
                    }
                }, 150); 
            } else {
                setIsCapturing(false);
            }
        }
    }, [webcamRef, onCapture]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
        }
    }, []);

    const startRecording = useCallback(() => {
        if (!webcamRef.current?.video?.srcObject) return;
        
        const stream = webcamRef.current.video.srcObject as MediaStream;
        const mimeType = getSupportedVideoMimeType();
        
        try {
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            recordedChunks.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) recordedChunks.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: mimeType || 'video/webm' });
                const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                const file = new File([blob], `mindrevol-live-${Date.now()}.${ext}`, { type: blob.type });
                onCapture(file);
                
                setIsRecording(false);
                setRecordProgress(0);
            };

            mediaRecorder.start();
            setIsRecording(true);

            const startTime = Date.now();
            holdTimerRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / MAX_RECORD_DURATION) * 100, 100);
                setRecordProgress(progress);
                if (elapsed >= MAX_RECORD_DURATION) stopRecording();
            }, 50); 

        } catch (err) {
            console.error("Lỗi khởi tạo MediaRecorder:", err);
            toast.error("Thiết bị không hỗ trợ quay Live Photo");
        }
    }, [onCapture, stopRecording]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return; 
        pressTimerRef.current = setTimeout(() => {
            startRecording();
        }, 250);
    };

    const handlePointerUp = () => {
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
            pressTimerRef.current = null;
        }
        if (isRecording) stopRecording();
        else handleCapturePhoto();
    };

    const toggleCamera = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onCapture(e.target.files[0]); 
        }
    };

    return {
        webcamRef, fileInputRef,
        facingMode, isCapturing, isRecording, recordProgress,
        handlePointerDown, handlePointerUp, toggleCamera, handleGallerySelect
    };
};