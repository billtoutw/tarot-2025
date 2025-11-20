import { GoogleGenAI } from "@google/genai";
import { DrawnCard, Category } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTarotReading = async (
  category: Category,
  question: string,
  cards: DrawnCard[]
): Promise<ReadableStream<string>> => {
  const ai = getClient();
  
  if (!ai) {
    // Mock response or error if no API key
    return new ReadableStream({
      start(controller) {
        controller.enqueue("⚠️ 尚未設定 API Key。\n\n請在專案中設定 `.env` 檔案並填入 `API_KEY`，或在 GitHub Secrets 中設定。\n\n目前僅顯示模擬結果：\n\n## 🔮 模擬解讀\n星象顯示一切安好，但需要您連結真實的宇宙能量（API Key）。");
        controller.close();
      }
    });
  }

  const cardDescriptions = cards
    .map(
      (c, index) => {
        const positionName = c.position; // Past, Present, Future
        const orientation = c.isReversed ? "逆位 (Reversed)" : "正位 (Upright)";
        return `${index + 1}. ${positionName}: ${c.card.name} - ${orientation}`;
      }
    )
    .join("\n");

  // Streamlined prompt for faster inference start
  const userPrompt = `
    角色：塔羅大師。
    面向：${category}。
    問題：${question || "整體運勢"}。
    牌陣：
    ${cardDescriptions}

    請直接解讀，格式如下(用Markdown)：

    ## 🔮 整體氛圍
    (一句話總結)

    ## 🃏 牌面解析
    1. **過去 (${cards[0].card.name} ${cards[0].isReversed ? '逆' : '正'})**：(解析)
    2. **現在 (${cards[1].card.name} ${cards[1].isReversed ? '逆' : '正'})**：(解析)
    3. **未來 (${cards[2].card.name} ${cards[2].isReversed ? '逆' : '正'})**：(解析)

    ## ✨ 大師指引
    (給予溫暖、具體且富有哲理的建議)

    **要求**：
    1. 解析需結合正逆位意義。逆位請強調阻礙、內在轉化或能量失衡。
    2. 語氣神秘優雅但白話易懂。
    3. 輸出速度要快，不要輸出任何前言。
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        // Slightly lower temperature for faster, more focused output
        temperature: 0.7, 
      }
    });

    // Create a readable stream to yield text chunks
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("命運訊號受到干擾，請重新連結...");
  }
};