"use client";
import { useState, ChangeEvent } from "react";
import Tesseract from "tesseract.js";

export default function OCRUploader() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });
      setText(text);
    } catch (error) {
      console.error("OCR error:", error);
      setText("Error recognizing text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleImage} />
      {loading && <p>Recognizing text...</p>}
      {text && <textarea value={text} readOnly rows={6} />}
    </>
  );
}
