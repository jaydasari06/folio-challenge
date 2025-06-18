import { getCurrentPageContext, selection } from "@canva/design";
import { DesignElement, QAAnalysisRequest } from '../types/qa-types';

/**
 * Utility functions for interacting with Canva's design APIs
 * and extracting design data for QA analysis
 */

let selectedElements: DesignElement[] = [];
let hasActiveSelection = false;

// Initialize selection listeners
export function initializeSelectionListeners() {
  console.log("🎯 Initializing design element selection listeners...");
  
  // Listen for text selection
  selection.registerOnChange({
    scope: "plaintext",
    onChange: (event) => {
      console.log("� Text elements selected:", event.count);
      updateSelectedElements("text", event);
    }
  });

  // Listen for image selection  
  selection.registerOnChange({
    scope: "image",
    onChange: (event) => {
      console.log("🖼️ Image elements selected:", event.count);
      updateSelectedElements("image", event);
    }
  });

  // Listen for richtext selection
  selection.registerOnChange({
    scope: "richtext", 
    onChange: (event) => {
      console.log("📄 Rich text elements selected:", event.count);
      updateSelectedElements("text", event);
    }
  });
}

async function updateSelectedElements(elementType: string, event: any) {
  try {
    if (event.count > 0) {
      console.log(`✅ Reading ${event.count} selected ${elementType} elements...`);
      const draft = await event.read();
      
      const elements: DesignElement[] = draft.contents.map((content: any, index: number) => {
        const element: DesignElement = {
          id: `selected-${elementType}-${index}`,
          type: elementType as any,
          properties: extractPropertiesFromContent(content, elementType)
        };
        
        console.log(`📋 Extracted element:`, element);
        return element;
      });
      
      selectedElements = [...selectedElements.filter(e => !e.type.includes(elementType)), ...elements];
      hasActiveSelection = true;
      
      console.log(`🎯 Updated selection: ${selectedElements.length} total elements`);
    } else {
      // Remove elements of this type when none selected
      selectedElements = selectedElements.filter(e => !e.type.includes(elementType));
      hasActiveSelection = selectedElements.length > 0;
      
      console.log(`🎯 Cleared ${elementType} selection: ${selectedElements.length} remaining`);
    }
  } catch (error) {
    console.error(`❌ Error reading selected ${elementType}:`, error);
  }
}

function extractPropertiesFromContent(content: any, elementType: string): DesignElement['properties'] {
  const properties: DesignElement['properties'] = {};
  
  console.log(`� Extracting properties from ${elementType} content:`, content);
  
  if (elementType === "text" || elementType === "richtext") {
    // Extract text properties
    if (content.text) properties.text = content.text;
    if (content.fontSize) properties.fontSize = content.fontSize;
    if (content.fontFamily) properties.fontFamily = content.fontFamily;
    if (content.color) properties.color = content.color;
    if (content.backgroundColor) properties.backgroundColor = content.backgroundColor;
    
    // Extract positioning if available
    if (content.position) properties.position = content.position;
    if (content.dimensions) properties.dimensions = content.dimensions;
    if (content.width && content.height) {
      properties.dimensions = { width: content.width, height: content.height };
    }
  } else if (elementType === "image") {
    // Extract image properties
    if (content.altText !== undefined) properties.altText = content.altText;
    if (content.alt !== undefined) properties.altText = content.alt;
    
    // Extract positioning if available
    if (content.position) properties.position = content.position;
    if (content.dimensions) properties.dimensions = content.dimensions;
    if (content.width && content.height) {
      properties.dimensions = { width: content.width, height: content.height };
    }
  }
  
  console.log(`✅ Extracted properties:`, properties);
  return properties;
}

export async function getDesignElements(): Promise<DesignElement[]> {
  try {
    console.log("🔍 Extracting design elements from Canva page...");
    
    // Check if we have selected elements first
    if (hasActiveSelection && selectedElements.length > 0) {
      console.log(`✅ Using ${selectedElements.length} selected design elements for analysis`);
      return selectedElements;
    }
    
    // If no selection, provide guidance and create demonstration elements
    console.log("⚠️ No elements currently selected. Creating demonstration elements...");
    console.log("💡 TIP: Select elements on your design to analyze real content!");
    
    const context = await getCurrentPageContext();
    console.log("📄 Page context:", context);
    
    // Create demonstration elements based on page context
    const elements: DesignElement[] = [];
    
    if (!context || !context.dimensions) {
      console.log("⚠️ No page context available, using fallback detection");
      
      const fallbackElement: DesignElement = {
        id: `demo-${Date.now()}`,
        type: 'text',
        properties: {
          position: { x: 100, y: 100 },
          dimensions: { width: 200, height: 30 },
          color: '#666666',
          fontSize: 16,
          fontFamily: 'Arial',
          text: 'Demo: Select elements to analyze real content'
        }
      };
      elements.push(fallbackElement);
    } else {
      console.log("✅ Creating demonstration elements for unselected analysis...");
      
      const pageWidth = context.dimensions.width;
      const pageHeight = context.dimensions.height;
      
      console.log(`📏 Page dimensions: ${pageWidth} x ${pageHeight}`);
      
      // Create a notice element
      const noticeElement: DesignElement = {
        id: 'demo-notice',
        type: 'text',
        properties: {
          position: { x: 50, y: 20 },
          dimensions: { width: Math.min(500, pageWidth - 100), height: 40 },
          color: '#FF6B6B',
          backgroundColor: '#FFFFFF',
          fontSize: 18,
          fontFamily: 'Inter',
          text: '💡 Select design elements to analyze real content'
        }
      };
      elements.push(noticeElement);
      
      // Force a problematic scenario for demonstration (instead of random)
      // This ensures users always see issues when no elements are selected
      let scenario = 1; // Always use contrast issues for now
      console.log(`📋 Using forced demonstration scenario ${scenario} (contrast issues)`);
      
      switch (scenario) {
        case 0:
          console.log("📋 Scenario 0: Good design elements");
          elements.push(...createGoodDesignElements(pageWidth, pageHeight));
          break;
        case 1:
          console.log("📋 Scenario 1: Contrast issues elements");
          elements.push(...createContrastIssuesElements(pageWidth, pageHeight));
          break;
        case 2:
          console.log("📋 Scenario 2: Typography issues elements");
          elements.push(...createTypographyIssuesElements(pageWidth, pageHeight));
          break;
        case 3:
          console.log("📋 Scenario 3: Spacing issues elements");
          elements.push(...createSpacingIssuesElements(pageWidth, pageHeight));
          break;
        case 4:
          console.log("📋 Scenario 4: Accessibility issues elements");
          elements.push(...createAccessibilityIssuesElements(pageWidth, pageHeight));
          break;
      }
    }
    
    console.log(`✅ Generated ${elements.length} demonstration elements:`, elements);
    return elements;
    
  } catch (error) {
    console.error("❌ Error extracting design elements:", error);
    
    return [{
      id: 'error-fallback',
      type: 'text',
      properties: {
        color: '#FF0000',
        fontSize: 16,
        fontFamily: 'Arial',
        position: { x: 100, y: 100 },
        dimensions: { width: 300, height: 30 },
        text: 'Error: Unable to analyze design elements'
      }
    }];
  }
}

function detectElementType(item: any): DesignElement['type'] {
  // Try to determine element type from the item data
  if (item.type) {
    switch (item.type.toLowerCase()) {
      case 'text':
      case 'textbox':
        return 'text';
      case 'image':
      case 'photo':
        return 'image';
      case 'shape':
      case 'rectangle':
      case 'circle':
      case 'polygon':
        return 'shape';
      case 'group':
        return 'group';
      default:
        return 'shape';
    }
  }
  
  // Fallback detection based on properties
  if (item.text || item.content) return 'text';
  if (item.src || item.url || item.imageData) return 'image';
  return 'shape';
}

function extractElementProperties(item: any, index: number): DesignElement['properties'] {
  const properties: DesignElement['properties'] = {};
  
  // Extract position (try multiple possible property names)
  const x = item.x || item.left || item.transform?.x || (index * 100);
  const y = item.y || item.top || item.transform?.y || (index * 50);
  properties.position = { x, y };
  
  // Extract dimensions
  const width = item.width || item.w || item.bounds?.width || 100;
  const height = item.height || item.h || item.bounds?.height || 50;
  properties.dimensions = { width, height };
  
  // Extract colors
  if (item.color || item.fill || item.fillColor) {
    properties.color = item.color || item.fill || item.fillColor;
  }
  
  // Extract text properties
  if (item.text || item.content) {
    properties.text = item.text || item.content;
    properties.fontSize = item.fontSize || item.size || 16;
    properties.fontFamily = item.fontFamily || item.font || 'Arial';
  }
  
  // Extract alt text for images
  if (item.alt || item.altText || item.description) {
    properties.altText = item.alt || item.altText || item.description;
  }
  
  return properties;
}

export async function createAnalysisRequest(): Promise<QAAnalysisRequest> {
  const elements = await getDesignElements();
  
  return {
    designId: `design-${Date.now()}`,
    elements,
    analysisOptions: {
      checkContrast: true,
      checkAlignment: true,
      checkSpacing: true,
      checkTypography: true,
      checkAccessibility: true
    }
  };
}

export function calculateContrastRatio(color1: string, color2: string): number {
  // Mock contrast calculation
  // In production, this would implement the WCAG contrast ratio formula
  return Math.random() * 10 + 1; // Random ratio between 1 and 11
}

export function isAccessibilityCompliant(contrastRatio: number, fontSize: number): boolean {
  // WCAG 2.1 guidelines
  if (fontSize >= 18) {
    return contrastRatio >= 3.0; // Large text
  }
  return contrastRatio >= 4.5; // Normal text
}

export async function captureDesignSnapshot(): Promise<string | null> {
  try {
    // This would use Canva's APIs to capture a snapshot of the current design
    // For now, return null since we don't have this functionality in the mock
    return null;
  } catch (error) {
    console.error('Failed to capture design snapshot:', error);
    return null;
  }
}

// Scenario generators for varied QA analysis demonstrations

function createGoodDesignElements(pageWidth: number, pageHeight: number): DesignElement[] {
  return [
    {
      id: 'good-heading',
      type: 'text',
      properties: {
        position: { x: 50, y: 50 },
        dimensions: { width: Math.min(400, pageWidth - 100), height: 40 },
        color: '#1a1a1a', // High contrast
        backgroundColor: '#FFFFFF',
        fontSize: 32, // Good readable size
        fontFamily: 'Inter',
        text: 'Well-Designed Heading'
      }
    },
    {
      id: 'good-body',
      type: 'text',
      properties: {
        position: { x: 50, y: 110 }, // Good spacing
        dimensions: { width: Math.min(500, pageWidth - 100), height: 60 },
        color: '#333333', // Good contrast
        backgroundColor: '#FFFFFF',
        fontSize: 16, // Readable size
        fontFamily: 'Inter',
        text: 'This is well-spaced body text with good contrast and readable font size.'
      }
    },
    {
      id: 'good-image',
      type: 'image',
      properties: {
        position: { x: 50, y: 190 },
        dimensions: { width: Math.min(300, pageWidth - 100), height: 200 },
        altText: 'Descriptive alt text for accessibility' // Good accessibility
      }
    }
  ];
}

function createContrastIssuesElements(pageWidth: number, pageHeight: number): DesignElement[] {
  return [
    {
      id: 'low-contrast-text',
      type: 'text',
      properties: {
        position: { x: 50, y: 50 },
        dimensions: { width: Math.min(400, pageWidth - 100), height: 40 },
        color: '#CCCCCC', // Very low contrast on white
        backgroundColor: '#FFFFFF',
        fontSize: 24,
        fontFamily: 'Arial',
        text: 'Low Contrast Text'
      }
    },
    {
      id: 'bad-contrast-button',
      type: 'shape',
      properties: {
        position: { x: 50, y: 120 },
        dimensions: { width: 120, height: 40 },
        color: '#FFD700', // Light yellow button
        backgroundColor: '#FFFF99' // Very light yellow background - poor contrast
      }
    },
    {
      id: 'gray-on-gray',
      type: 'text',
      properties: {
        position: { x: 50, y: 180 },
        dimensions: { width: Math.min(350, pageWidth - 100), height: 30 },
        color: '#888888', // Gray text
        backgroundColor: '#BBBBBB', // Gray background
        fontSize: 14,
        fontFamily: 'Arial',
        text: 'Gray text on gray background'
      }
    }
  ];
}

function createTypographyIssuesElements(pageWidth: number, pageHeight: number): DesignElement[] {
  return [
    {
      id: 'tiny-text',
      type: 'text',
      properties: {
        position: { x: 50, y: 50 },
        dimensions: { width: Math.min(400, pageWidth - 100), height: 20 },
        color: '#333333',
        backgroundColor: '#FFFFFF',
        fontSize: 8, // Too small to read
        fontFamily: 'Arial',
        text: 'This text is way too small to read comfortably'
      }
    },
    {
      id: 'inconsistent-fonts',
      type: 'text',
      properties: {
        position: { x: 50, y: 90 },
        dimensions: { width: Math.min(300, pageWidth - 100), height: 30 },
        color: '#333333',
        backgroundColor: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Comic Sans MS', // Poor font choice for professional design
        text: 'Comic Sans in a professional design'
      }
    },
    {
      id: 'massive-text',
      type: 'text',
      properties: {
        position: { x: 50, y: 140 },
        dimensions: { width: Math.min(200, pageWidth - 100), height: 80 },
        color: '#333333',
        backgroundColor: '#FFFFFF',
        fontSize: 72, // Excessively large
        fontFamily: 'Times',
        text: 'HUGE'
      }
    }
  ];
}

function createSpacingIssuesElements(pageWidth: number, pageHeight: number): DesignElement[] {
  return [
    {
      id: 'crowded-text-1',
      type: 'text',
      properties: {
        position: { x: 50, y: 50 },
        dimensions: { width: Math.min(200, pageWidth - 100), height: 25 },
        color: '#333333',
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Arial',
        text: 'Crowded text 1'
      }
    },
    {
      id: 'crowded-text-2',
      type: 'text',
      properties: {
        position: { x: 52, y: 52 }, // Almost overlapping
        dimensions: { width: Math.min(180, pageWidth - 100), height: 25 },
        color: '#333333',
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Arial',
        text: 'Crowded text 2'
      }
    },
    {
      id: 'misaligned-element',
      type: 'shape',
      properties: {
        position: { x: 53, y: 100 }, // Slightly misaligned
        dimensions: { width: 100, height: 30 },
        color: '#FF6B6B'
      }
    },
    {
      id: 'another-misaligned',
      type: 'shape',
      properties: {
        position: { x: 47, y: 140 }, // Different alignment
        dimensions: { width: 110, height: 30 },
        color: '#4ECDC4'
      }
    }
  ];
}

function createAccessibilityIssuesElements(pageWidth: number, pageHeight: number): DesignElement[] {
  return [
    {
      id: 'image-no-alt',
      type: 'image',
      properties: {
        position: { x: 50, y: 50 },
        dimensions: { width: Math.min(250, pageWidth - 100), height: 150 },
        altText: '' // Missing alt text
      }
    },
    {
      id: 'decorative-text',
      type: 'text',
      properties: {
        position: { x: 50, y: 220 },
        dimensions: { width: Math.min(300, pageWidth - 100), height: 40 },
        color: '#FF0000', // Red text that might be problematic for colorblind users
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Arial',
        text: 'Important: Click here (color-only indication)'
      }
    },
    {
      id: 'poor-focus-indicator',
      type: 'shape',
      properties: {
        position: { x: 50, y: 280 },
        dimensions: { width: 120, height: 35 },
        color: '#E0E0E0', // Very subtle, poor focus visibility
        backgroundColor: '#F5F5F5'
      }
    }
  ];
}
