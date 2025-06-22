#!/usr/bin/env python3
"""
Simple Gemini test to check basic connectivity
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
print(f"🔑 API Key: {'Found' if api_key else 'Missing'}")

if api_key:
    genai.configure(api_key=api_key)
    
    # Just try one model
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Model created successfully")
        
        # Simple test
        response = model.generate_content("Hi")
        print(f"✅ Response received: {type(response)}")
        
        # Check attributes
        print(f"Has .text: {hasattr(response, 'text')}")
        print(f"Has .parts: {hasattr(response, 'parts')}")
        print(f"Has .candidates: {hasattr(response, 'candidates')}")
        
        if hasattr(response, 'text'):
            print(f"✅ Text: {response.text}")
        elif hasattr(response, 'candidates'):
            print(f"✅ Candidates found: {len(response.candidates)}")
            if response.candidates:
                candidate = response.candidates[0]
                print(f"✅ First candidate: {candidate}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
else:
    print("❌ No API key found")
