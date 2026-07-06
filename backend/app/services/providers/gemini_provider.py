import time

from google import genai
from google.genai import errors


def translate_with_gemini(text: str, prompt: str, api_key: str) -> str:
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. Add it to backend/.env or use TRANSLATION_PROVIDER=mock."
        )

    client = genai.Client(api_key=api_key)

    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            translated_text = response.text

            if not translated_text:
                raise ValueError("Gemini returned an empty translation response.")

            return translated_text.strip()

        except errors.ServerError as error:
            if attempt < max_attempts - 1:
                time.sleep(2)
                continue

            raise RuntimeError(
                "Gemini is temporarily unavailable because the model is experiencing high demand. Please try again later or switch TRANSLATION_PROVIDER=mock."
            ) from error