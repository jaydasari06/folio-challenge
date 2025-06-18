#!/usr/bin/env python3
"""
Design QA Agent Backend
A Flask API server that analyzes design elements and provides QA feedback
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
import colorsys
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

class DesignQAAnalyzer:
    """Main class for analyzing design elements and generating QA reports"""
    
    def __init__(self):
        self.analysis_rules = {
            'contrast': {'min_ratio': 4.5, 'large_text_ratio': 3.0},
            'typography': {'max_fonts': 3, 'min_font_size': 12},
            'spacing': {'min_spacing': 8, 'consistent_grid': True},
            'accessibility': {'require_alt_text': True},
            'alignment': {'tolerance': 5}  # pixels
        }

    def analyze_design(self, elements: List[Dict], options: Dict) -> Dict:
        """
        Main analysis function that processes design elements
        and returns a comprehensive QA report
        """
        start_time = time.time()
        
        print(f"🔍 Backend received {len(elements)} elements for analysis")
        print(f"📋 Elements: {json.dumps(elements, indent=2)}")
        print(f"⚙️ Options: {options}")
        
        # Transform frontend elements to backend format
        transformed_elements = self._transform_elements(elements)
        print(f"🔄 Transformed to {len(transformed_elements)} elements")
        
        issues = []
        
        # Run different types of analysis based on options
        if options.get('checkContrast', True):
            issues.extend(self._check_contrast(transformed_elements))
        
        if options.get('checkTypography', True):
            issues.extend(self._check_typography(transformed_elements))
        
        if options.get('checkSpacing', True):
            issues.extend(self._check_spacing(transformed_elements))
        
        if options.get('checkAccessibility', True):
            issues.extend(self._check_accessibility(transformed_elements))
        
        if options.get('checkAlignment', True):
            issues.extend(self._check_alignment(transformed_elements))
        
        # Calculate overall score
        overall_score = self._calculate_score(issues)
        
        # Generate report
        analysis_time = round(time.time() - start_time, 2)
        
        report = {
            'overallScore': overall_score,
            'totalIssues': len(issues),
            'issues': issues,
            'passed': max(0, 17 - len(issues)),  # Assuming 17 total checks
            'failed': len(issues),
            'analysisTime': analysis_time,
            'timestamp': datetime.now().isoformat()
        }
        
        return report

    def _check_contrast(self, elements: List[Dict]) -> List[Dict]:
        """Check color contrast ratios for text elements"""
        issues = []
        
        text_elements = [e for e in elements if e.get('type') == 'text']
        print(f"🎨 Checking contrast for {len(text_elements)} text elements")
        
        for element in text_elements:
            text_color = element.get('color', '#000000')
            bg_color = element.get('backgroundColor', '#FFFFFF')
            font_size = element.get('fontSize', 16)
            
            print(f"   📝 Element {element.get('id')}: {text_color} on {bg_color}, size {font_size}px")
            
            # Calculate contrast ratio
            contrast_ratio = self._calculate_contrast_ratio(text_color, bg_color)
            
            # Determine required ratio based on font size
            required_ratio = (self.analysis_rules['contrast']['large_text_ratio'] 
                            if font_size >= 18 
                            else self.analysis_rules['contrast']['min_ratio'])
            
            print(f"   📊 Contrast ratio: {contrast_ratio:.1f}:1 (required: {required_ratio}:1)")
            
            if contrast_ratio < required_ratio:
                severity = 'critical' if contrast_ratio < 3.0 else 'high'
                issues.append({
                    'id': f"contrast-{element.get('id', 'unknown')}",
                    'type': 'contrast',
                    'severity': severity,
                    'title': 'Low color contrast detected',
                    'description': f'Text contrast ratio is {contrast_ratio:.1f}:1, below WCAG requirement of {required_ratio}:1',
                    'suggestion': f'Increase contrast to at least {required_ratio}:1 by using darker text or lighter background colors',
                    'elementId': element.get('id')
                })
                print(f"   ⚠️ Added contrast issue: {severity}")
        
        print(f"🎨 Contrast check complete: {len(issues)} issues found")
        return issues

    def _check_typography(self, elements: List[Dict]) -> List[Dict]:
        """Check typography consistency and readability"""
        issues = []
        
        text_elements = [e for e in elements if e.get('type') == 'text']
        print(f"🔤 Checking typography for {len(text_elements)} text elements")
        
        if not text_elements:
            print("🔤 No text elements found for typography analysis")
            return issues
        
        # Check font variety
        font_families = []
        small_text_elements = []
        
        for element in text_elements:
            font_family = element.get('fontFamily', 'Unknown')
            font_size = element.get('fontSize', 16)
            
            print(f"   📝 Element {element.get('id')}: {font_family}, {font_size}px")
            
            if font_family not in font_families:
                font_families.append(font_family)
            
            # Check for text that's too small
            if font_size < self.analysis_rules['typography']['min_font_size']:
                small_text_elements.append(element)
                print(f"   ⚠️ Small text detected: {font_size}px")
        
        print(f"🔤 Found {len(font_families)} font families: {font_families}")
        
        # Too many fonts issue
        max_fonts = self.analysis_rules['typography']['max_fonts']
        if len(font_families) > max_fonts:
            issues.append({
                'id': 'typography-font-variety',
                'type': 'typography',
                'severity': 'medium',
                'title': 'Too many font families',
                'description': f'{len(font_families)} different font families detected: {", ".join(font_families)}',
                'suggestion': f'Limit to {max_fonts} font families maximum for better visual consistency'
            })
            print(f"   ⚠️ Too many fonts issue added")
        
        # Small text issues
        for element in small_text_elements:
            font_size = element.get('fontSize', 0)
            issues.append({
                'id': f"typography-small-{element.get('id', 'unknown')}",
                'type': 'typography',
                'severity': 'medium',
                'title': 'Text size too small',
                'description': f'Text size is {font_size}px, which may be difficult to read',
                'suggestion': f'Use minimum {self.analysis_rules["typography"]["min_font_size"]}px for body text, 16px for mobile',
                'elementId': element.get('id')
            })
            print(f"   ⚠️ Small text issue added for {element.get('id')}")
        
        print(f"🔤 Typography check complete: {len(issues)} issues found")
        return issues

    def _check_spacing(self, elements: List[Dict]) -> List[Dict]:
        """Check spacing consistency and layout"""
        issues = []
        
        # Get all elements with positions
        positioned_elements = [e for e in elements if e.get('properties', {}).get('position')]
        
        if len(positioned_elements) < 2:
            return issues
        
        # Check for consistent spacing patterns
        spacings = []
        for i, element1 in enumerate(positioned_elements):
            for element2 in positioned_elements[i+1:]:
                pos1 = element1['properties']['position']
                pos2 = element2['properties']['position']
                
                # Calculate horizontal and vertical distances
                h_distance = abs(pos1['x'] - pos2['x'])
                v_distance = abs(pos1['y'] - pos2['y'])
                
                spacings.extend([h_distance, v_distance])
        
        # Look for inconsistent spacing (simplified algorithm)
        if spacings:
            # Check if elements are too close together
            min_spacing = self.analysis_rules['spacing']['min_spacing']
            close_elements = [s for s in spacings if 0 < s < min_spacing]
            
            if close_elements:
                issues.append({
                    'id': 'spacing-cramped',
                    'type': 'spacing',
                    'severity': 'low',
                    'title': 'Elements too close together',
                    'description': f'Found {len(close_elements)} instances of elements closer than {min_spacing}px',
                    'suggestion': f'Increase spacing to at least {min_spacing}px for better visual breathing room'
                })
            
            # Check for inconsistent spacing patterns
            unique_spacings = list(set(int(s) for s in spacings if s > 0))
            if len(unique_spacings) > 6:  # Too many different spacing values
                issues.append({
                    'id': 'spacing-inconsistent',
                    'type': 'spacing',
                    'severity': 'medium',
                    'title': 'Inconsistent spacing detected',
                    'description': f'Multiple different spacing values found: {len(unique_spacings)} variations',
                    'suggestion': 'Use consistent spacing based on an 8px grid system (8px, 16px, 24px, etc.)'
                })
        
        return issues

    def _check_accessibility(self, elements: List[Dict]) -> List[Dict]:
        """Check accessibility compliance"""
        issues = []
        
        # Check for images without alt text
        image_elements = [e for e in elements if e.get('type') == 'image']
        images_without_alt = []
        
        for element in image_elements:
            properties = element.get('properties', {})
            alt_text = properties.get('altText', '')
            
            if not alt_text or alt_text.strip() == '':
                images_without_alt.append(element)
        
        if images_without_alt:
            severity = 'critical' if len(images_without_alt) > 2 else 'high'
            issues.append({
                'id': 'accessibility-alt-text',
                'type': 'accessibility',
                'severity': severity,
                'title': 'Missing alt text for images',
                'description': f'{len(images_without_alt)} images found without alternative text descriptions',
                'suggestion': 'Add descriptive alt text for all images to improve screen reader accessibility'
            })
        
        # Check for sufficient color contrast (duplicate check but for accessibility category)
        text_elements = [e for e in elements if e.get('type') == 'text']
        low_contrast_count = 0
        
        for element in text_elements:
            properties = element.get('properties', {})
            text_color = properties.get('color', '#000000')
            bg_color = properties.get('backgroundColor', '#FFFFFF')
            
            contrast_ratio = self._calculate_contrast_ratio(text_color, bg_color)
            if contrast_ratio < 4.5:
                low_contrast_count += 1
        
        if low_contrast_count > 0:
            issues.append({
                'id': 'accessibility-contrast',
                'type': 'accessibility',
                'severity': 'high',
                'title': 'WCAG contrast requirements not met',
                'description': f'{low_contrast_count} text elements with insufficient contrast for accessibility',
                'suggestion': 'Ensure all text meets WCAG 2.1 AA contrast requirements (4.5:1 for normal text)'
            })
        
        return issues

    def _check_alignment(self, elements: List[Dict]) -> List[Dict]:
        """Check element alignment and grid consistency"""
        issues = []
        
        positioned_elements = [e for e in elements if e.get('properties', {}).get('position')]
        
        if len(positioned_elements) < 3:
            return issues
        
        # Check for alignment along common axes
        tolerance = self.analysis_rules['alignment']['tolerance']
        
        # Group elements by similar X positions (vertical alignment)
        x_positions = [e['properties']['position']['x'] for e in positioned_elements]
        y_positions = [e['properties']['position']['y'] for e in positioned_elements]
        
        # Find elements that are close but not perfectly aligned
        misaligned_elements = 0
        
        for i, pos1 in enumerate(x_positions):
            for pos2 in x_positions[i+1:]:
                diff = abs(pos1 - pos2)
                if 1 <= diff <= tolerance:  # Close but not aligned
                    misaligned_elements += 1
        
        for i, pos1 in enumerate(y_positions):
            for pos2 in y_positions[i+1:]:
                diff = abs(pos1 - pos2)
                if 1 <= diff <= tolerance:  # Close but not aligned
                    misaligned_elements += 1
        
        if misaligned_elements > 2:
            issues.append({
                'id': 'alignment-misaligned',
                'type': 'alignment',
                'severity': 'medium',
                'title': 'Elements not properly aligned',
                'description': f'Found {misaligned_elements} instances of elements that are close but not perfectly aligned',
                'suggestion': 'Use grid guidelines and alignment tools to create consistent visual relationships'
            })
        
        return issues

    def _calculate_contrast_ratio(self, color1: str, color2: str) -> float:
        """Calculate WCAG contrast ratio between two colors"""
        try:
            # Convert hex colors to RGB
            rgb1 = self._hex_to_rgb(color1)
            rgb2 = self._hex_to_rgb(color2)
            
            # Calculate relative luminance
            lum1 = self._get_luminance(rgb1)
            lum2 = self._get_luminance(rgb2)
            
            # Calculate contrast ratio
            lighter = max(lum1, lum2)
            darker = min(lum1, lum2)
            
            return round((lighter + 0.05) / (darker + 0.05), 2)
        except:
            return 4.5  # Default to passing ratio if calculation fails

    def _hex_to_rgb(self, hex_color: str) -> tuple:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def _get_luminance(self, rgb: tuple) -> float:
        """Calculate relative luminance for WCAG contrast"""
        def adjust_color(c):
            c = c / 255.0
            return c / 12.92 if c <= 0.03928 else pow((c + 0.055) / 1.055, 2.4)
        
        r, g, b = [adjust_color(c) for c in rgb]
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    def _calculate_score(self, issues: List[Dict]) -> int:
        """Calculate overall design quality score based on issues"""
        score = 100
        
        for issue in issues:
            severity = issue.get('severity', 'low')
            if severity == 'critical':
                score -= 20
            elif severity == 'high':
                score -= 15
            elif severity == 'medium':
                score -= 10
            elif severity == 'low':
                score -= 5
        
        return max(0, min(100, score))

    def _transform_elements(self, elements: List[Dict]) -> List[Dict]:
        """Transform frontend element format to backend expected format"""
        transformed = []
        
        for element in elements:
            # Frontend sends: { id, type, properties: { position: {x, y}, dimensions: {width, height}, ... } }
            # Backend expects: { id, type, x, y, width, height, fontSize, color, ... }
            
            element_id = element.get('id', 'unknown')
            element_type = element.get('type', 'unknown')
            properties = element.get('properties', {})
            
            transformed_element = {
                'id': element_id,
                'type': element_type
            }
            
            # Extract position
            position = properties.get('position', {})
            transformed_element['x'] = position.get('x', 0)
            transformed_element['y'] = position.get('y', 0)
            
            # Extract dimensions  
            dimensions = properties.get('dimensions', {})
            transformed_element['width'] = dimensions.get('width', 100)
            transformed_element['height'] = dimensions.get('height', 50)
            
            # Copy other properties directly
            for key in ['color', 'backgroundColor', 'fontSize', 'fontFamily', 'text', 'altText']:
                if key in properties:
                    transformed_element[key] = properties[key]
            
            # Add default background color if missing (for contrast analysis)
            if 'backgroundColor' not in transformed_element and element_type == 'text':
                transformed_element['backgroundColor'] = '#FFFFFF'
                
            transformed.append(transformed_element)
        
        return transformed
    
# Initialize analyzer
qa_analyzer = DesignQAAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_design():
    """Main analysis endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        elements = data.get('elements', [])
        analysis_options = data.get('analysisOptions', {
            'checkContrast': True,
            'checkAlignment': True,
            'checkSpacing': True,
            'checkTypography': True,
            'checkAccessibility': True
        })
        
        # Perform analysis
        report = qa_analyzer.analyze_design(elements, analysis_options)
        
        return jsonify({
            'success': True,
            'report': report
        })
        
    except Exception as e:
        app.logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/api/analyze/test', methods=['GET'])
def test_analysis():
    """Test endpoint with sample data"""
    sample_elements = [
        {
            'id': 'text-1',
            'type': 'text',
            'properties': {
                'color': '#333333',
                'backgroundColor': '#FFFFFF',
                'fontSize': 16,
                'fontFamily': 'Arial',
                'position': {'x': 100, 'y': 50},
                'text': 'Sample headline'
            }
        },
        {
            'id': 'text-2',
            'type': 'text',
            'properties': {
                'color': '#888888',  # Low contrast
                'backgroundColor': '#FFFFFF',
                'fontSize': 10,  # Too small
                'fontFamily': 'Helvetica',  # Different font
                'position': {'x': 103, 'y': 52},  # Slightly misaligned
                'text': 'Sample body text'
            }
        },
        {
            'id': 'image-1',
            'type': 'image',
            'properties': {
                'position': {'x': 50, 'y': 200},
                'altText': ''  # Missing alt text
            }
        }
    ]
    
    report = qa_analyzer.analyze_design(sample_elements, {
        'checkContrast': True,
        'checkAlignment': True,
        'checkSpacing': True,
        'checkTypography': True,
        'checkAccessibility': True
    })
    
    return jsonify({
        'success': True,
        'report': report,
        'sample_data': sample_elements
    })

if __name__ == '__main__':
    print("🚀 Design QA Agent Backend Starting...")
    print("📊 Available endpoints:")
    print("   GET  /health - Health check")
    print("   POST /api/analyze - Analyze design elements")
    print("   GET  /api/analyze/test - Test with sample data")
    print("🌐 Backend running on http://localhost:5001")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
