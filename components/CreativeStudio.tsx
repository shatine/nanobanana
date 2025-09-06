import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppTab } from '../types';
import type { GeneratedContent, PromptExample } from '../types';
import { generationPrompts, editingPrompts } from '../constants';
import { generateImageFromText, editImage } from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon, SparklesIcon, ChevronDownIcon, DownloadIcon, PaintBrushIcon, EraserIcon, XCircleIcon, LockClosedIcon, LockOpenIcon } from './icons';

const PromptGuide: React.FC<{
  prompts: PromptExample[];
  onSelectPrompt: (prompt: string) => void;
}> = ({ prompts, onSelectPrompt }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2">프롬프트 기법 가이드</h3>
      {prompts.map((p, index) => (
        <div key={index} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center p-4 text-left font-medium text-sky-300 hover:bg-slate-700/50 transition-colors"
          >
            <span>{p.title}</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <p className="text-sm text-slate-400 italic mb-3">"{p.template}"</p>
              <p className="text-sm text-slate-300 mb-4">{p.prompt}</p>
              <button
                onClick={() => onSelectPrompt(p.prompt)}
                className="w-full text-sm bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                프롬프트 사용하기
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


const CreativeStudio: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATION);
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [result, setResult] = useState<GeneratedContent | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Masking state
    const [brushSize, setBrushSize] = useState<number>(40);
    const [isErasing, setIsErasing] = useState<boolean>(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef<boolean>(false);
    const [hasMask, setHasMask] = useState<boolean>(false);

    // Character consistency state
    const [lockedCharacterImage, setLockedCharacterImage] = useState<string | null>(null);


    const clearMask = useCallback(() => {
        const canvas = maskCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setHasMask(false);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null); // Clear previous result
            clearMask(); // Clear mask from previous image
        }
    };
    
    const handleImageLoad = useCallback(() => {
        const image = imageRef.current;
        const canvas = maskCanvasRef.current;
        if (image && canvas) {
            // Set canvas resolution to match the image's natural resolution
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            // CSS will visually scale the canvas to match the displayed image size
            clearMask();
        }
    }, [clearMask]);

    // Drawing logic
    const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
        const canvas = maskCanvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const touch = 'touches' in e ? e.touches[0] : null;

        const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
        const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;
        
        // Scale mouse coordinates to match canvas resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }, []);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const ctx = maskCanvasRef.current?.getContext('2d');
        const coords = getCoords(e);
        if (ctx && coords) {
            isDrawing.current = true;
            e.preventDefault();
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
        }
    }, [getCoords]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return;
        
        const ctx = maskCanvasRef.current?.getContext('2d');
        const coords = getCoords(e);
        if (ctx && coords) {
            e.preventDefault();
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Use a vibrant color for the mask for good visibility
            ctx.strokeStyle = 'rgba(225, 29, 72, 0.7)'; 
            ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
            if (!isErasing) {
                setHasMask(true);
            }
        }
    }, [brushSize, isErasing, getCoords]);

    const stopDrawing = useCallback(() => {
        isDrawing.current = false;
        maskCanvasRef.current?.getContext('2d')?.closePath();
    }, []);

    const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const handleLockCharacter = (imageUrl: string) => {
        setLockedCharacterImage(imageUrl);
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUnlockCharacter = () => {
        setLockedCharacterImage(null);
    };

    const handleSubmit = async () => {
        if (!prompt || loading) return;
        if (activeTab === AppTab.EDITING && !imageFile) {
            setError('이미지를 업로드해주세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let apiResult: GeneratedContent;

            if (activeTab === AppTab.GENERATION && lockedCharacterImage) {
                 const lockedImageFile = await dataUrlToFile(lockedCharacterImage, 'locked-character.png');
                 apiResult = await editImage(prompt, lockedImageFile);
            } else if (activeTab === AppTab.GENERATION) {
                apiResult = await generateImageFromText(prompt);
            } else { // Editing tab
                let maskData: string | undefined = undefined;
                if (imageFile && hasMask) {
                    const canvas = maskCanvasRef.current;
                    if (canvas) {
                        maskData = canvas.toDataURL('image/png').split(',')[1];
                    }
                }
                apiResult = await editImage(prompt, imageFile!, maskData);
            }
            setResult(apiResult);
        } catch (err: any) {
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPrompt = useCallback((selectedPrompt: string) => {
        setPrompt(selectedPrompt);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
    const isSubmitDisabled = loading || !prompt || (activeTab === AppTab.EDITING && !imageFile);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Tabs */}
                <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setActiveTab(AppTab.GENERATION)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === AppTab.GENERATION ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                        이미지 생성 (Text-to-Image)
                    </button>
                    <button
                        onClick={() => setActiveTab(AppTab.EDITING)}
                        className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === AppTab.EDITING ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                        이미지 편집 (Image+Text)
                    </button>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    {activeTab === AppTab.EDITING && (
                         <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <label htmlFor="file-upload" className="cursor-pointer block border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-lg p-6 text-center transition-colors">
                                {imagePreview ? (
                                    <div className="relative w-full max-w-md mx-auto">
                                      <img ref={imageRef} src={imagePreview} alt="업로드 미리보기" className="max-h-64 mx-auto rounded-md" onLoad={handleImageLoad} />
                                      <canvas
                                          ref={maskCanvasRef}
                                          className={`absolute top-0 left-0 w-full h-full rounded-md ${isErasing ? 'cursor-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuNDQzIDIuMjNhLjc1Ljc1IDAgMDEuMTE0IDBsOC4yNSA4LjI1YS47NS43NSAwIDAxMCAxLjExNGwtOC4yNSA4LjI1YS43NS43NSAwIDAxLTEuMTE0IDBMMi4xOTMgMTEuNmEuNzUuNzUgMCAwMTAtMS4xMTRsOC4yNS04LjI1ek0xMS4yNSAxMC4xNTVsLTEuOTIgMS45MmEuNzUuNzUgMCAwMDAgMS4wNmwzLjA3IDMuMDdhLjc1Ljc1IDAgMDAxLjA2IDBsMS45Mi0xLjkyYS43NS43NSAwIDAwMC0xLjA2bC0zLjA3LTMuMDdhLjc1Ljc1IDAgMDAtMS4wNiAwek0yMi41IDExLjZhLjc1Ljc1IDAgMDEtLjc1LS43NVY4LjI1YS43NS43NSAwIDAxMS41IDB2Mi42YS43NS43NSAwIDAxLS43NS43NXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=),auto]' : 'cursor-crosshair'}`}
                                          style={{ pointerEvents: imagePreview ? 'auto' : 'none' }}
                                          onMouseDown={startDrawing}
                                          onMouseMove={draw}
                                          onMouseUp={stopDrawing}
                                          onMouseLeave={stopDrawing}
                                          onTouchStart={startDrawing}
                                          onTouchMove={draw}
                                          onTouchEnd={stopDrawing}
                                      />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400">
                                        <UploadIcon className="w-12 h-12 mb-2" />
                                        <span className="font-semibold">이미지 업로드</span>
                                        <p className="text-xs">편집할 이미지를 여기에 드롭하거나 클릭하여 선택하세요.</p>
                                    </div>
                                )}
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            {imageFile && <p className="text-center text-xs mt-2 text-slate-400">{imageFile.name}</p>}

                            {imagePreview && (
                                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg space-y-4">
                                    <h4 className="font-semibold text-slate-200 text-sm">마스킹 도구 (인페인팅용)</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-2">
                                            <label htmlFor="brush-size" className="text-xs text-slate-400">브러시 크기: {brushSize}px</label>
                                            <input type="range" id="brush-size" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsErasing(false)} title="브러시" className={`p-2 rounded-md transition-colors ${!isErasing ? 'bg-sky-600 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}>
                                                <PaintBrushIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setIsErasing(true)} title="지우개" className={`p-2 rounded-md transition-colors ${isErasing ? 'bg-sky-600 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}>
                                                <EraserIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={clearMask} title="마스크 지우기" className="p-2 rounded-md bg-slate-600 hover:bg-slate-500 text-slate-300 transition-colors">
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400">이미지에서 변경하고 싶은 부분을 칠하세요.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {lockedCharacterImage && activeTab === AppTab.GENERATION && (
                        <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <img src={lockedCharacterImage} alt="Locked character" className="w-12 h-12 rounded-md object-cover" />
                                <div>
                                    <h4 className="font-semibold text-slate-200">캐릭터 잠금 활성화</h4>
                                    <p className="text-xs text-slate-400">새로운 프롬프트는 이 캐릭터를 기반으로 이미지를 생성합니다.</p>
                                </div>
                            </div>
                            <button onClick={handleUnlockCharacter} className="flex items-center gap-2 text-sm bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md transition-colors">
                                <LockOpenIcon className="w-4 h-4" />
                                <span>잠금 해제</span>
                            </button>
                        </div>
                    )}

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={activeTab === AppTab.GENERATION ? "생성할 이미지에 대한 설명을 입력하세요..." : "이미지를 어떻게 편집할지 설명하세요..."}
                        className="w-full h-36 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow text-slate-200 placeholder-slate-500"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>{activeTab === AppTab.GENERATION ? '생성하기' : '편집하기'}</span>
                    </button>
                </div>
                
                {/* Result Area */}
                <div className="min-h-[400px] flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                    {loading && <Loader message={activeTab === AppTab.GENERATION ? "이미지를 생성 중입니다..." : "이미지를 편집 중입니다..."}/>}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {result && (
                        <div className="space-y-4 w-full">
                           {result.imageUrl && (
                             <div className="relative bg-black rounded-lg p-2 group">
                               <img src={result.imageUrl} alt="생성된 이미지" className="w-auto max-w-full max-h-[512px] mx-auto rounded" />
                                <a
                                  href={result.imageUrl}
                                  download="gemini-generated-image.png"
                                  className="absolute bottom-4 right-4 bg-slate-900/70 text-white p-2 rounded-full hover:bg-sky-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  aria-label="Download image"
                                  title="이미지 다운로드"
                                >
                                  <DownloadIcon className="w-6 h-6" />
                                </a>
                                {activeTab === AppTab.GENERATION && !lockedCharacterImage && (
                                    <button
                                        onClick={() => handleLockCharacter(result.imageUrl!)}
                                        className="absolute bottom-4 left-4 bg-slate-900/70 text-white p-2 rounded-full hover:bg-sky-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        aria-label="Lock character"
                                        title="캐릭터 잠금"
                                    >
                                        <LockClosedIcon className="w-6 h-6" />
                                    </button>
                                )}
                             </div>
                           )}
                           {result.text && (
                             <div className="p-4 bg-slate-700 rounded-lg">
                                <p className="text-slate-300 whitespace-pre-wrap">{result.text}</p>
                             </div>
                           )}
                        </div>
                    )}
                    {!loading && !error && !result && (
                        <div className="text-center text-slate-500">
                           {lockedCharacterImage && activeTab === AppTab.GENERATION ? (
                             <>
                               <img src={lockedCharacterImage} alt="Locked character preview" className="w-24 h-24 rounded-lg mx-auto mb-4 border-2 border-slate-600" />
                                <p>잠긴 캐릭터가 준비되었습니다.</p>
                                <p className="text-sm">새로운 프롬프트를 입력하여 다른 장면을 만들어 보세요.</p>
                             </>
                           ) : (
                             <>
                               <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                               <p>결과가 여기에 표시됩니다.</p>
                            </>
                           )}
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <PromptGuide 
                  prompts={activeTab === AppTab.GENERATION ? generationPrompts : editingPrompts}
                  onSelectPrompt={handleSelectPrompt}
                />
            </div>
        </div>
    );
};

export default CreativeStudio;