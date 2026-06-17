import google.generativeai as genai
from app.config import get_settings
import json
from typing import List, Dict

settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """You are Sentinel AI, an expert risk analyst specializing in assumption extraction and strategic risk assessment. Analyze the provided document text and extract key assumptions, their categories, health scores, and statuses.

Return ONLY valid JSON in this exact format:
[
  {
    "assumption": "string",
    "category": "string",
    "health_score": integer,
    "status": "healthy" | "warning" | "critical",
    "reasoning": "string"
  }
]"""


def extract_assumptions(document_text: str) -> List[Dict]:
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        return _mock_assumptions()

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            [SYSTEM_PROMPT, f"Document text:\n\n{document_text[:30000]}"]
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception:
        return _mock_assumptions()


def generate_recommendations(assumptions: List[Dict]) -> List[Dict]:
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        return _mock_recommendations()

    try:
        prompt = f"Based on these assumptions, generate strategic recommendations as JSON array: {json.dumps(assumptions)}"
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception:
        return _mock_recommendations()


def copilot_chat(project_data: str, question: str) -> str:
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        return "To enable AI Copilot, set your GEMINI_API_KEY in the .env file."

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = f"""You are Sentinel AI's strategic copilot. Analyze this project data and answer the question.

Project Data:
{project_data[:20000]}

Question: {question}

Provide a clear, actionable response."""
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Unable to process request: {str(e)}"


def _mock_assumptions() -> List[Dict]:
    return [
        {"assumption": "Regulations remain favorable", "category": "Regulatory", "health_score": 31, "status": "critical", "reasoning": "Recent policy changes indicate stricter oversight."},
        {"assumption": "Internet connectivity is available", "category": "Infrastructure", "health_score": 67, "status": "warning", "reasoning": "Coverage gaps in rural areas remain a concern."},
        {"assumption": "Customer adoption increases", "category": "Market", "health_score": 92, "status": "healthy", "reasoning": "Strong pipeline and positive early feedback."},
        {"assumption": "Weather conditions remain manageable", "category": "Environmental", "health_score": 74, "status": "warning", "reasoning": "Seasonal weather patterns could disrupt operations."},
    ]


def _mock_recommendations() -> List[Dict]:
    return [
        {"title": "Diversify regulatory risk", "description": "Engage with multiple regulatory bodies to anticipate changes.", "priority": "high"},
        {"title": "Expand connectivity strategy", "description": "Invest in offline-capable systems for rural operations.", "priority": "medium"},
        {"title": "Accelerate customer onboarding", "description": "Leverage early adopter feedback to refine the product.", "priority": "high"},
    ]
