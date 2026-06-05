import os
from typing import List, Dict, Optional
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ActionItemExtract(BaseModel):
    content: str
    assignee: Optional[str] = None
    deadline: Optional[str] = None
    priority: str = "MEDIUM"


class AIService:
    def __init__(self):
        self.client = client

    def generate_summary(self, transcription: str, model: str = "gpt-4") -> str:
        """
        Generate a concise summary of the meeting transcription
        """
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful meeting assistant. Create a clear, concise summary of the meeting. Include key discussion points, decisions made, and important context. Format with bullet points for readability."
                    },
                    {
                        "role": "user",
                        "content": f"Please summarize this meeting transcript:\n\n{transcription}"
                    }
                ],
                temperature=0.3,
                max_tokens=1500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Summary generation error: {str(e)}")
            return "Failed to generate summary"

    def extract_action_items(self, transcription: str, model: str = "gpt-4") -> List[Dict]:
        """
        Extract action items from the meeting transcription
        Returns a list of action item dictionaries
        """
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are a helpful meeting assistant. Extract action items from the meeting transcript.

For each action item, identify:
1. The specific task or action
2. Who is assigned (mentioned with @ or by name)
3. Any mentioned deadline
4. Priority level (URGENT, HIGH, MEDIUM, LOW) based on context

Format your response as a JSON array of objects with fields: content, assignee, deadline, priority.
Only include actual action items - tasks that need to be done by someone.
Be specific and clear in the task descriptions."""
                    },
                    {
                        "role": "user",
                        "content": f"Extract action items from this meeting transcript:\n\n{transcription}"
                    }
                ],
                temperature=0.2,
                max_tokens=2000
            )

            # Parse the JSON response
            content = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]

            import json
            action_items = json.loads(content)

            # Validate and normalize
            valid_items = []
            for item in action_items:
                if isinstance(item, dict) and "content" in item:
                    valid_items.append({
                        "content": item.get("content", ""),
                        "assignee": item.get("assignee", None),
                        "deadline": item.get("deadline", None),
                        "priority": item.get("priority", "MEDIUM").upper() if item.get("priority") else "MEDIUM"
                    })

            return valid_items

        except Exception as e:
            print(f"Action item extraction error: {str(e)}")
            return []

    def process_meeting(
        self,
        transcription: str,
        user_settings: Optional[Dict] = None
    ) -> Dict:
        """
        Process a meeting transcription: generate summary and extract action items
        """
        model = user_settings.get("preferred_ai_model", "gpt-4") if user_settings else "gpt-4"

        # Generate summary
        summary = self.generate_summary(transcription, model)

        # Extract action items
        action_items = self.extract_action_items(transcription, model)

        return {
            "summary": summary,
            "action_items": action_items
        }


# Global instance
ai_service = AIService()
