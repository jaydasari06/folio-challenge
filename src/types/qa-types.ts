// Types for Design QA Agent

export interface QAIssue {
  id: string;
  type: 'contrast' | 'alignment' | 'spacing' | 'typography' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestion: string;
  elementId?: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AIAnalysis {
  ai_enabled: boolean;
  summary: string;
  suggestions: string[];
  overall_feedback: string;
  design_principles?: string[];
}

export interface QAReport {
  overallScore: number;
  totalIssues: number;
  issues: QAIssue[];
  passed: number;
  failed: number;
  analysisTime: number;
  timestamp: string;
  aiAnalysis?: AIAnalysis;
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'group';
  properties: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontFamily?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
    text?: string;
    altText?: string;
  };
}

export interface QAAnalysisRequest {
  designId: string;
  elements: DesignElement[];
  options?: {
    checkContrast?: boolean;
    checkAlignment?: boolean;
    checkSpacing?: boolean;
    checkTypography?: boolean;
    checkAccessibility?: boolean;
  };
  analysisOptions: {
    checkContrast: boolean;
    checkAlignment: boolean;
    checkSpacing: boolean;
    checkTypography: boolean;
    checkAccessibility: boolean;
  };
}

export interface QAAnalysisResponse {
  success: boolean;
  report: QAReport;
  error?: string;
}
