#!/usr/bin/env python3
"""
Debug Gemini response format
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def debug_gemini_response():
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    if not gemini_api_key or gemini_api_key == 'your_gemini_api_key_here':
        print("❌ No valid GEMINI_API_KEY found")
        return
    
    genai.configure(api_key=gemini_api_key)
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hello, respond with 'AI working'")
        
        print("🔍 Response object type:", type(response))
        print("🔍 Response attributes:", dir(response))
        print()
        
        print("🔍 Testing .text attribute:")
        if hasattr(response, 'text'):
            print(f"   ✅ .text exists: {type(response.text)}")
            print(f"   Content: '{response.text}'")
        else:
            print("   ❌ .text does not exist")
        print()
        
        print("🔍 Testing .candidates attribute:")
        if hasattr(response, 'candidates'):
            print(f"   ✅ .candidates exists: {type(response.candidates)}")
            print(f"   Length: {len(response.candidates)}")
            if len(response.candidates) > 0:
                candidate = response.candidates[0]
                print(f"   First candidate type: {type(candidate)}")
                print(f"   First candidate attributes: {dir(candidate)}")
                
                if hasattr(candidate, 'content'):
                    print(f"   Candidate content type: {type(candidate.content)}")
                    print(f"   Candidate content attributes: {dir(candidate.content)}")
                    
                    if hasattr(candidate.content, 'parts'):
                        print(f"   Parts type: {type(candidate.content.parts)}")
                        print(f"   Parts length: {len(candidate.content.parts)}")
                        if len(candidate.content.parts) > 0:
                            part = candidate.content.parts[0]
                            print(f"   First part type: {type(part)}")
                            print(f"   First part attributes: {dir(part)}")
                            if hasattr(part, 'text'):
                                print(f"   Part text: '{part.text}'")
        else:
            print("   ❌ .candidates does not exist")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    debug_gemini_response()
