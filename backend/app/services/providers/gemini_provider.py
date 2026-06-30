def translate_with_gemini(text: str, prompt: str, api_key: str) -> str:
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. Add it to backend/.env or use TRANSLATION_PROVIDER=mock."
        )

    raise NotImplementedError(
        "Gemini provider is prepared but not implemented yet."
    )