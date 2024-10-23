import React, { useState } from 'react';
import { Volume2, Upload, Mic, Book } from 'lucide-react';
import type { RecognizedWord } from '../services/imageRecognition';
import AudioRecorderPanel from './AudioRecorderPanel';

interface ImageWithWordsProps {
  image: string;
  words: RecognizedWord[];
  onReupload: () => void;
  isLoading: boolean;
}

const ImageWithWords: React.FC<ImageWithWordsProps> = ({ 
  image, 
  words = [], 
  onReupload,
  isLoading 
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const playWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    playWord(word); // 直接播放发音
  };

  const handlePlaySound = () => {
    if (selectedWord) {
      playWord(selectedWord);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="relative">
        <img 
          src={image} 
          alt="Uploaded" 
          className={`max-w-full h-auto rounded-lg shadow-lg ${isLoading ? 'blur-sm' : ''}`}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-lg">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-medium text-shadow">识别中...</p>
          </div>
        )}

        {!isLoading && words.map((word, index) => (
          <div
            key={`word-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${word.box.x + (word.box.width / 2)}%`, 
              top: `${word.box.y + (word.box.height / 2)}%`,
              zIndex: 20
            }}
          >
            <div 
              className={`inline-flex flex-col transform transition-all duration-300 hover:scale-110 cursor-pointer ${
                selectedWord === word.word ? 'scale-110' : ''
              }`}
              onClick={() => handleWordClick(word.word)}
            >
              <div className={`bg-white/95 px-3 py-1.5 rounded-t-md text-sm font-medium transition-colors whitespace-nowrap shadow-sm border border-gray-100/90 ${
                selectedWord === word.word ? 'bg-blue-50/95 text-blue-600' : 'text-gray-700 hover:bg-blue-50/95'
              }`}>
                {word.word}
              </div>
              
              <div className="bg-gray-800/95 px-3 py-1 rounded-b-md text-xs text-white text-center whitespace-nowrap border-t border-gray-700/90">
                {word.translation}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={onReupload}
          className="bg-white/80 hover:bg-gray-50/90 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all"
        >
          <Upload className="w-4 h-4 mr-2" />
          重新上传照片
        </button>
      </div>

      {selectedWord && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{selectedWord}</h3>
                <p className="text-sm text-gray-500">
                  {words.find(w => w.word === selectedWord)?.translation}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePlaySound}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600">播放</span>
                </button>
                <button
                  onClick={handleStartRecording}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                    <Mic className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600">录音</span>
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Book className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600">关闭</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRecording && selectedWord && (
        <AudioRecorderPanel
          word={selectedWord}
          onClose={() => setIsRecording(false)}
        />
      )}
    </div>
  );
};

export default ImageWithWords;