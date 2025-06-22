import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../app';
import { qaAnalysisService } from '../services/qa-analysis-service';
import { TestAppI18nProvider } from '@canva/app-i18n-kit';
import { TestAppUiProvider } from '@canva/app-ui-kit';
import { getCurrentPageContext } from '@canva/design';

// Mock the QA analysis service
jest.mock('../services/qa-analysis-service', () => ({
  qaAnalysisService: {
    analyzeDesign: jest.fn(),
  },
}));

jest.mock('../utils/design-utils', () => ({
  initializeSelectionListeners: jest.fn(),
  createAnalysisRequest: jest.fn(() => Promise.resolve({
    designId: 'test-design',
    elements: [],
    analysisOptions: {
      checkContrast: true,
      checkAlignment: true,
      checkSpacing: true,
      checkTypography: true,
      checkAccessibility: true
    }
  })),
}));

const mockQaAnalysisService = qaAnalysisService as jest.Mocked<typeof qaAnalysisService>;
const mockGetCurrentPageContext = jest.mocked(getCurrentPageContext);

// Helper function to render App with required providers
const renderApp = () => {
  return render(
    <TestAppI18nProvider>
      <TestAppUiProvider>
        <App />
      </TestAppUiProvider>
    </TestAppI18nProvider>
  );
};

describe('Design QA Agent App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Set up default mock for getCurrentPageContext
    mockGetCurrentPageContext.mockResolvedValue({ 
      dimensions: { width: 800, height: 600 } 
    });
  });

  test('renders the main title', () => {
    renderApp();
    expect(screen.getByText('Design QA Agent')).toBeInTheDocument();
  });

  test('shows run analysis button when no report exists', async () => {
    renderApp();
    
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

    renderApp();
    
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

    renderApp();
    
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

    renderApp();
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Overview')).toHaveLength(2); // There are two Overview elements in the tab
      expect(screen.getByRole('tab', { name: /Issues/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Tips/i })).toBeInTheDocument();
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

    renderApp();
    
    await waitFor(() => {
      const button = screen.getByText('Run Design QA Analysis');
      fireEvent.click(button);
    });

    // The app should handle the error gracefully without crashing
    await waitFor(() => {
      expect(screen.getByText('Run Design QA Analysis')).toBeInTheDocument();
    });
  });

  test('shows empty state when no design content', async () => {
    // Mock getCurrentPageContext to return no dimensions
    mockGetCurrentPageContext.mockResolvedValue({ dimensions: undefined });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('No design detected')).toBeInTheDocument();
    });
  });
});
