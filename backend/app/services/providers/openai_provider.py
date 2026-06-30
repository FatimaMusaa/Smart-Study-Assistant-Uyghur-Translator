def translate_with_openai(text: str, prompt: str, api_key: str) -> str:
    if not api_key:
        raise ValueError(
            "OPENAI_API_KEY is missing. Add it to backend/.env or use TRANSLATION_PROVIDER=mock."
        )

    raise NotImplementedError(
        "OpenAI provider is prepared but not implemented yet."
    )