import React, { useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import ImageWithWords from './components/ImageWithWords';
import { recognizeImage } from './services/imageRecognition';
import type { RecognizedWord } from './services/imageRecognition';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [words, setWords] = useState<RecognizedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        setImage(imageDataUrl);
        setIsLoading(true);
        try {
          const recognizedWords = await recognizeImage(imageDataUrl);
          setWords(recognizedWords);
        } catch (error) {
          console.error('Recognition error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    console.log('Camera capture not implemented');
  };

  const handleReupload = () => {
    setImage(null);
    setWords([]);
    setIsLoading(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
          亲子英语时光记
        </h1>
        <p className="text-lg text-gray-600">
          让宝宝的每一张照片说英语
        </p>
      </div>
      
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-2xl">
        {!image ? (
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-600 mb-6">上传照片或拍照开始学习英语吧！</p>
            <div className="flex space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-300 hover:shadow-lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                上传照片
              </button>
              <button
                onClick={handleCameraCapture}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-300 hover:shadow-lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                拍照
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <ImageWithWords 
            image={image} 
            words={words} 
            onReupload={handleReupload}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default App;