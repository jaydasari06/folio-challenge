import { QAAnalysisRequest, QAAnalysisResponse, QAReport, QAIssue } from '../types/qa-types';

// Mock backend service for Design QA Analysis
// In production, this would make HTTP requests to your backend API

export class QAAnalysisService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5001/api') {
    this.baseUrl = baseUrl;
  }

  async analyzeDesign(request: QAAnalysisRequest): Promise<QAAnalysisResponse> {
    try {
      console.log('🌐 QA Service: Sending request to backend...');
      console.log('📤 Request elements:', request.elements);
      console.log('⚙️ Request options:', request.options || request.analysisOptions);
      
      // Make actual API call to the Python backend
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          elements: request.elements,
          options: request.options || request.analysisOptions || {
            checkContrast: true,
            checkAlignment: true,
            checkSpacing: true,
            checkTypography: true,
            checkAccessibility: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const backendResponse = await response.json();
      console.log('📥 Backend response:', backendResponse);
      
      // Transform backend response to match our frontend types
      const transformedResponse = this.transformBackendResponse(backendResponse);
      console.log('🔄 Transformed response:', transformedResponse);
      
      return transformedResponse;
    } catch (error) {
      console.error('QA Analysis API Error:', error);
      
      // Fall back to mock data if backend is unavailable
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Backend unavailable, falling back to mock data');
        return this.mockAnalysis(request);
      }
      
      return {
        success: false,
        report: this.getEmptyReport(),
        error: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }

  private async mockAnalysis(request: QAAnalysisRequest): Promise<QAAnalysisResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const issues = this.generateMockIssues(request.elements);
    const report: QAReport = {
      overallScore: this.calculateOverallScore(issues),
      totalIssues: issues.length,
      issues,
      passed: Math.max(0, 17 - issues.length), // Assuming 17 total checks
      failed: issues.length,
      analysisTime: 2.3,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      report
    };
  }

  private generateMockIssues(elements: any[]): QAIssue[] {
    const issues: QAIssue[] = [];
    const possibleIssues = [
      {
        type: 'contrast' as const,
        severity: 'high' as const,
        title: 'Low color contrast detected',
        description: 'Text with insufficient contrast ratio (2.1:1) found on element',
        suggestion: 'Increase contrast to at least 4.5:1 for normal text or use darker colors'
      },
      {
        type: 'alignment' as const,
        severity: 'medium' as const,
        title: 'Misaligned elements',
        description: 'Multiple text elements are not properly aligned to a consistent grid',
        suggestion: 'Use grid guidelines or alignment tools to create visual harmony'
      },
      {
        type: 'spacing' as const,
        severity: 'medium' as const,
        title: 'Inconsistent spacing',
        description: 'Varying margins and padding detected throughout the design',
        suggestion: 'Apply consistent 8px grid system for spacing between elements'
      },
      {
        type: 'typography' as const,
        severity: 'low' as const,
        title: 'Too many font variations',
        description: 'Multiple font families detected, which may reduce visual cohesion',
        suggestion: 'Limit to 2-3 font families for better consistency and readability'
      },
      {
        type: 'accessibility' as const,
        severity: 'critical' as const,
        title: 'Missing alt text',
        description: 'Images without alternative text descriptions found',
        suggestion: 'Add descriptive alt text for all images to improve accessibility'
      },
      {
        type: 'typography' as const,
        severity: 'medium' as const,
        title: 'Small text size',
        description: 'Text smaller than 12px detected, which may be hard to read',
        suggestion: 'Use minimum 12px font size for body text, 16px for mobile'
      },
      {
        type: 'spacing' as const,
        severity: 'low' as const,
        title: 'Cramped layout',
        description: 'Elements too close together, creating visual clutter',
        suggestion: 'Increase spacing between elements for better visual breathing room'
      }
    ];

    // Randomly select 3-6 issues for the mock
    const numIssues = Math.floor(Math.random() * 4) + 3;
    const selectedIssues = possibleIssues
      .sort(() => Math.random() - 0.5)
      .slice(0, numIssues)
      .map((issue, index) => ({
        ...issue,
        id: `issue-${index + 1}`,
        elementId: `element-${Math.floor(Math.random() * elements.length)}`
      }));

    return selectedIssues;
  }

  private calculateOverallScore(issues: QAIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private getEmptyReport(): QAReport {
    return {
      overallScore: 0,
      totalIssues: 0,
      issues: [],
      passed: 0,
      failed: 0,
      analysisTime: 0,
      timestamp: new Date().toISOString()
    };
  }

  private transformBackendResponse(backendResponse: any): QAAnalysisResponse {
    try {
      console.log('🔄 Transforming backend response:', backendResponse);
      
      // Handle the actual structure returned by our Python backend
      if (backendResponse.report) {
        // Backend returns: {success: true, report: {...}}
        const report = backendResponse.report;
        
        console.log('📊 Backend report structure:', report);
        
        return {
          success: backendResponse.success || true,
          report: {
            overallScore: report.overallScore || 0,
            totalIssues: report.totalIssues || (report.issues ? report.issues.length : 0),
            issues: report.issues || [],
            passed: report.passed || 0,
            failed: report.failed || 0,
            analysisTime: report.analysisTime || 0,
            timestamp: report.timestamp || new Date().toISOString(),
            // Include AI analysis data from backend
            aiAnalysis: report.aiAnalysis
          }
        };
      }
      
      // Legacy fallback for old backend structure (categories-based)
      const issues: QAIssue[] = [];
      
      if (backendResponse.categories) {
        Object.entries(backendResponse.categories).forEach(([category, categoryData]: [string, any]) => {
          if (categoryData.issues) {
            categoryData.issues.forEach((issue: any) => {
              issues.push({
                id: issue.id || `${category}_${Date.now()}_${Math.random()}`,
                type: category as QAIssue['type'],
                severity: issue.severity || 'medium',
                title: this.generateIssueTitle(category, issue),
                description: issue.message || `${category} issue detected`,
                suggestion: this.generateSuggestion(category, issue),
                elementId: issue.elementId,
                coordinates: issue.coordinates
              });
            });
          }
        });
      }

      const report: QAReport = {
        overallScore: backendResponse.score || 0,
        totalIssues: backendResponse.totalIssues || issues.length,
        issues,
        passed: Math.max(0, 20 - issues.length),
        failed: issues.length,
        analysisTime: 2.5,
        timestamp: backendResponse.analyzedAt || new Date().toISOString()
      };

      return {
        success: true,
        report
      };
    } catch (error) {
      console.error('Error transforming backend response:', error);
      return {
        success: false,
        report: this.getEmptyReport(),
        error: 'Failed to process analysis results'
      };
    }
  }

  private generateIssueTitle(category: string, issue: any): string {
    switch (category) {
      case 'contrast':
        return 'Low Color Contrast';
      case 'typography':
        return 'Typography Issue';
      case 'spacing':
        return 'Spacing Problem';
      case 'alignment':
        return 'Alignment Issue';
      case 'accessibility':
        return 'Accessibility Concern';
      default:
        return 'Design Issue';
    }
  }

  private generateSuggestion(category: string, issue: any): string {
    if (issue.recommendedValue) {
      return `Consider changing to ${issue.recommendedValue}`;
    }
    
    switch (category) {
      case 'contrast':
        return 'Increase contrast between text and background colors to meet WCAG guidelines.';
      case 'typography':
        return 'Adjust font size, family, or weight for better readability.';
      case 'spacing':
        return 'Add more space between elements for better visual hierarchy.';
      case 'alignment':
        return 'Align elements consistently for a more professional appearance.';
      case 'accessibility':
        return 'Add accessibility features like alt text and proper heading structure.';
      default:
        return 'Review this element for design consistency.';
    }
  }
}

export const qaAnalysisService = new QAAnalysisService();
