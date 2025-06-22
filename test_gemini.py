#!/usr/bin/env python3
"""
Quick test script for Gemini API integration
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def test_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"🔑 API Key found: {'Yes' if api_key else 'No'}")
    
    if not api_key:
        print("❌ No API key found in .env file")
        return False
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # First, list available models
    try:
        print("📋 Available models:")
        models = genai.list_models()
        generation_models = []
        for model in models:
            if hasattr(model, 'supported_generation_methods') and 'generateContent' in model.supported_generation_methods:
                print(f"   ✅ {model.name}")
                generation_models.append(model.name)
        
        if not generation_models:
            print("❌ No generation models found")
            return False
            
    except Exception as e:
        print(f"❌ Failed to list models: {str(e)}")
        # Try with common model names anyway
        # Try the first available model
        generation_models = [
            'gemini-2.5-flash',
            'gemini-1.5-flash', 
            'gemini-1.5-flash-8b',
            'gemini-1.5-pro'
        ]
    
    # Try the first available model
    for model_name in generation_models:
        try:
            print(f"🧪 Testing model: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            # Simple test
            response = model.generate_content("Hello! Respond with 'Gemini AI is working!'")
            
            # Handle different response formats more carefully
            try:
                if hasattr(response, 'text') and response.text:
                    response_text = response.text
                elif hasattr(response, 'parts') and response.parts:
                    response_text = ''.join([part.text for part in response.parts if hasattr(part, 'text')])
                elif hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                        response_text = ''.join([part.text for part in candidate.content.parts if hasattr(part, 'text')])
                    else:
                        response_text = str(candidate)
                else:
                    response_text = str(response)
            except Exception as e:
                response_text = f"Response parsing error: {str(e)}"
                
            print(f"✅ Success! Response: {response_text}")
            
            # Test with design analysis
            design_prompt = """
            Analyze this design data and provide feedback:
            Elements: 3 text elements, 2 images
            Issues: Low contrast detected, inconsistent fonts
            
            Provide brief analysis in JSON format:
            {"summary": "brief assessment", "suggestions": ["tip 1", "tip 2"]}
            """
            
            design_response = model.generate_content(design_prompt)
            try:
                if hasattr(design_response, 'text') and design_response.text:
                    design_text = design_response.text
                elif hasattr(design_response, 'parts') and design_response.parts:
                    design_text = ''.join([part.text for part in design_response.parts if hasattr(part, 'text')])
                elif hasattr(design_response, 'candidates') and design_response.candidates:
                    candidate = design_response.candidates[0]
                    if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                        design_text = ''.join([part.text for part in candidate.content.parts if hasattr(part, 'text')])
                    else:
                        design_text = str(candidate)
                else:
                    design_text = str(design_response)
            except Exception as e:
                design_text = f"Response parsing error: {str(e)}"
                
            print(f"🎨 Design analysis response: {design_text[:200]}...")
            
            print(f"🎉 Model {model_name} works! Use this in your backend.")
            return True
            
        except Exception as e:
            print(f"❌ Failed with {model_name}: {str(e)}")
            continue
    
    print("❌ All models failed")
    return False

if __name__ == "__main__":
    print("🚀 Testing Gemini API Integration")
    print("=" * 40)
    test_gemini()
