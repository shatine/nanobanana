import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { GeneratedContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:image/png;base64,xxxxxxxx"
      // We need to strip the prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const processApiResponse = (response: GenerateContentResponse): GeneratedContent => {
    const result: GeneratedContent = { text: null, imageUrl: null };
    
    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error("안전 설정에 의해 콘텐츠가 차단되었습니다. 프롬프트를 수정해 주세요.");
    }

    const parts = response.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
        if (part.text) {
            result.text = (result.text || "") + part.text;
        } else if (part.inlineData) {
            const { mimeType, data } = part.inlineData;
            result.imageUrl = `data:${mimeType};base64,${data}`;
        }
    }
    return result;
}

export const generateImageFromText = async (prompt: string): Promise<GeneratedContent> => {
    try {
        // For consistency and to avoid potential auth issues with different endpoints,
        // we use the 'gemini-2.5-flash-image-preview' model via generateContent for pure text-to-image as well.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: "너는 이미지 생성 AI야. 사용자의 텍스트 프롬프트를 바탕으로 이미지를 생성하는 것이 너의 임무야. 대화하지 말고, 프롬프트에 대한 이미지를 바로 생성해줘.",
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const processed = processApiResponse(response);

        if (!processed.imageUrl) {
            const errorMessage = processed.text 
                ? `모델이 이미지를 반환하지 않고 텍스트로만 응답했습니다: "${processed.text}"`
                : "모델이 이미지를 반환하지 않았습니다. 프롬프트를 수정하거나 다른 이미지를 사용해 보세요.";
            throw new Error(errorMessage);
        }
        
        return processed;
    } catch (error) {
        console.error("Error generating image from text:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('SAFETY')) {
            throw new Error("안전 설정에 의해 이미지를 생성할 수 없습니다. 프롬프트를 수정해 주세요.");
        }
        if (errorMessage.includes('UNAUTHENTICATED')) {
             throw new Error("인증 오류가 발생했습니다. API 키를 확인하고 올바르게 설정되었는지 확인하세요.");
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("텍스트로 이미지 생성에 실패했습니다.");
    }
};

export const editImage = async (prompt: string, imageFile: File, maskBase64?: string): Promise<GeneratedContent> => {
    try {
        const base64Data = await fileToBase64(imageFile);
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type,
            },
        };
        const textPart = { text: prompt };

        const parts: ({ text: string; } | { inlineData: { data: string; mimeType: string; }; })[] = [imagePart, textPart];
        
        // Add mask part if it exists for inpainting
        if (maskBase64) {
            const maskPart = {
                inlineData: {
                    data: maskBase64,
                    mimeType: 'image/png'
                }
            };
            parts.push(maskPart);
        }


        // For image editing, `generateContent` with `gemini-2.5-flash-image-preview` is the correct approach.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: parts },
            config: {
                systemInstruction: "너는 이미지 편집 AI야. 사용자의 텍스트 프롬프트와 이미지를 바탕으로 기존 이미지를 수정하는 것이 너의 임무야. 대화하지 말고, 요청에 따라 이미지를 바로 편집해줘.",
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const processed = processApiResponse(response);

        // If the primary expectation (an edited image) is not met, treat it as an error.
        if (!processed.imageUrl) {
            const errorMessage = processed.text 
                ? `모델이 이미지를 반환하지 않고 텍스트로만 응답했습니다: "${processed.text}"`
                : "모델이 이미지를 반환하지 않았습니다. 프롬프트를 수정하거나 다른 이미지를 사용해 보세요.";
            throw new Error(errorMessage);
        }
        
        return processed;
    } catch (error) {
        console.error("Error editing image:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("이미지 편집에 실패했습니다.");
    }
};