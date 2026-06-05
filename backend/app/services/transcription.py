import os
import base64
import tempfile
from typing import Optional, Callable
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class TranscriptionService:
    def __init__(self):
        self.client = client

    async def transcribe_audio(
        self,
        audio_data: bytes,
        file_name: str = "audio.mp3",
        language: str = "en",
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> str:
        """
        Transcribe audio data using OpenAI Whisper API
        Returns: transcription text
        """
        try:
            if progress_callback:
                progress_callback(10)

            # Create a temporary file for the audio
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_name.split('.')[-1] or 'mp3'}") as temp_file:
                temp_file.write(audio_data)
                temp_path = temp_file.name

            if progress_callback:
                progress_callback(30)

            # Use OpenAI Whisper API
            with open(temp_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language if language else None,
                    response_format="text"
                )

            if progress_callback:
                progress_callback(80)

            # Clean up temp file
            os.unlink(temp_path)

            if progress_callback:
                progress_callback(100)

            return transcript

        except Exception as e:
            print(f"Transcription error: {str(e)}")
            raise Exception(f"Failed to transcribe audio: {str(e)}")

    async def transcribe_from_base64(
        self,
        base64_audio: str,
        file_name: str = "audio.mp3",
        language: str = "en"
    ) -> str:
        """
        Transcribe audio from base64 encoded string
        """
        audio_data = base64.b64decode(base64_audio)
        return await self.transcribe_audio(audio_data, file_name, language)


# Global instance
transcription_service = TranscriptionService()
