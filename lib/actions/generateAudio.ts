"use server";

export const generateAudio = async (text: string) => {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/NFG5qt843uXKj4pFvR7C", // Rachel voice
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Audio generation failed:", error);
    throw new Error("Failed to generate audio");
  }
};
