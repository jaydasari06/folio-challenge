import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../app';
import { qaAnalysisService } from '../services/qa-analysis-service';

// Mock the Canva modules
jest.mock('@canva/platform', () => ({
  requestOpenExternalUrl: jest.fn(),
}));

jest.mock('@canva/design', () => ({
  getCurrentPageContext: jest.fn(() => 
    Promise.resolve({ 
      dimensions: { width: 800, height: 600 } 
    })
  ),
}));

jest.mock('../services/qa-analysis-service');
jest.mock('../utils/design-utils');

const mockQaAnalysisService = qaAnalysisService as jest.Mocked<typeof qaAnalysisService>;

describe('Design QA Agent App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('Design QA Agent')).toBeInTheDocument();
  });

  test('shows run analysis button when no report exists', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Run Design QA Analysis')).toBeInTheDocument();
    });
  });

  test('runs QA analysis when button is clicked', async () => {
    const mockReport = {
      overallScore: 85,
      totalIssues: 2,
      issues: [
        {
          id: '1',
          type: 'contrast' as const,
          severity: 'medium' as const,
          title: 'Color contrast issue',
          description: 'Low contrast detected',
          suggestion: 'Increase contrast ratio'
        }
      ],
      passed: 15,
      failed: 2,
      analysisTime: 1.5,
      timestamp: new Date().toISOString()
    };

    mockQaAnalysisService.analyzeDesign.mockResolvedValue({
      success: true,
      report: mockReport
    });

    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockQaAnalysisService.analyzeDesign).toHaveBeenCalled();
    });
  });

  test('displays QA report after analysis', async () => {
    const mockReport = {
      overallScore: 78,
      totalIssues: 3,
      issues: [
        {
          id: '1',
          type: 'contrast' as const,
          severity: 'high' as const,
          title: 'Low color contrast',
          description: 'Text contrast is too low',
          suggestion: 'Use darker colors'
        }
      ],
      passed: 14,
      failed: 3,
      analysisTime: 2.1,
      timestamp: new Date().toISOString()
    };

    mockQaAnalysisService.analyzeDesign.mockResolvedValue({
      success: true,
      report: mockReport
    });

    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('Overall Design Score')).toBeInTheDocument();
      expect(screen.getByText('78/100')).toBeInTheDocument();
    });
  });

  test('shows tabs with correct content after analysis', async () => {
    const mockReport = {
      overallScore: 65,
      totalIssues: 4,
      issues: [
        {
          id: '1',
          type: 'accessibility' as const,
          severity: 'critical' as const,
          title: 'Missing alt text',
          description: 'Images without alt text',
          suggestion: 'Add descriptive alt text'
        }
      ],
      passed: 13,
      failed: 4,
      analysisTime: 1.8,
      timestamp: new Date().toISOString()
    };

    mockQaAnalysisService.analyzeDesign.mockResolvedValue({
      success: true,
      report: mockReport
    });

    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Issues')).toBeInTheDocument();
      expect(screen.getByText('Tips')).toBeInTheDocument();
    });
  });

  test('handles analysis errors gracefully', async () => {
    mockQaAnalysisService.analyzeDesign.mockResolvedValue({
      success: false,
      report: {
        overallScore: 0,
        totalIssues: 0,
        issues: [],
        passed: 0,
        failed: 0,
        analysisTime: 0,
        timestamp: new Date().toISOString()
      },
      error: 'Analysis failed'
    });

    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    // The app should handle the error gracefully without crashing
    await waitFor(() => {
      expect(screen.getByText('Run New Analysis')).toBeInTheDocument();
    });
  });

  test('shows empty state when no design content', async () => {
    // Mock getCurrentPageContext to return no dimensions
    const { getCurrentPageContext } = require('@canva/design');
    getCurrentPageContext.mockResolvedValue({ dimensions: null });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No design detected')).toBeInTheDocument();
    });
  });
});
