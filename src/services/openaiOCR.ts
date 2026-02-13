import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { OCRResult, Tile, TileColor } from '../types';

// WARNING: In a production app, never hardcode API keys! use a proxy or env variables.
// The user provided this Requesty key.
const API_KEY = 'rqsty-sk-LCanpFesSqO93eKeWBrGbpQd+EJZSEoqcdn3oXPiU64GHPTgkORfbdZZZoNVnELF4ddcT5ZT1CDcatYAN1Y262+SBSlVgQjD9kCG0b8eWg4=';
// Using Requesty Router (OpenAI Compatible Endpoint)
const API_URL = 'https://router.requesty.ai/v1/chat/completions';

export const analyzeImageWithGPT4 = async (imageUri: string): Promise<OCRResult> => {
  try {
    // 1. Resize and Compress Image to reduce payload size
    // Optimizing for Requesty router limits and speed.
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }], 
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 2. Read optimized image as Base64
    const base64Image = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
      encoding: 'base64',
    });

    // 3. Prepare Payload for Requesty Router (OpenAI compatible)
    const payload = {
      // User requested: openai/gpt-4.1-mini
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert OCR system for the board game '101 Okey'. 
          Your task is to identify the tiles in the image.
          
          Rules:
          - Tiles have numbers 1-13 in colors: red, black, blue, yellow.
          - Yellow numbers on white background are hard to see, look closely.
          - There are 'False Jokers' (fake jokers) which have a symbol (often a star or 'J') instead of a number. They have value 0.
          
          Return ONLY a valid JSON object with this structure:
          {
            "tiles": [
              { "value": number, "color": "red" | "black" | "blue" | "yellow", "isFalseJoker": boolean }
            ]
          }
          - If a tile is a False Joker, set value to 0 and isFalseJoker to true. Color might be null or irrelevant.
          - Do not include any markdown formatting (like \`\`\`json). Just the raw JSON string.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this Okey board and list all visible tiles."
            },
            {
              type: "image_url",
              image_url: {
                // OpenAI compatible format for Base64 images
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    };

    // 4. Send Request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Requesty API Error:", data);
        throw new Error(data.error?.message || "Verification Failed");
    }

    // 5. Parse Response (OpenAI Format)
    const content = data.choices[0]?.message?.content;
    console.log("Requesty Response:", content);

    if (!content) {
        throw new Error("AI returned empty response. Try again.");
    }
    
    // Clean potential markdown code blocks and <think> tags
    let cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // Extract JSON substring
    const firstBrace = cleanContent.indexOf('{');
    const lastBrace = cleanContent.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
    } else {
        console.error("No JSON braces found in response:", cleanContent);
        throw new Error("AI response did not contain valid JSON");
    }

    let parsed;
    try {
        parsed = JSON.parse(cleanContent);
    } catch (e) {
        console.error("JSON Parse Error. String was:", cleanContent);
        throw new Error("Failed to parse AI response: " + (e as Error).message);
    }

    // 6. Map to App's Tile Structure (add IDs)
    const tiles: Tile[] = parsed.tiles?.map((t: any) => ({
        id: Math.random().toString(36).substring(7),
        value: t.value,
        color: t.color,
        isFalseJoker: t.isFalseJoker || false
    })) || [];

    return {
      tiles,
      confidence: 1.0 
    };

  } catch (error) {
    console.error("OCR Service Error:", error);
    // Fallback to empty or rethrow
    return { tiles: [], confidence: 0 };
  }
};
