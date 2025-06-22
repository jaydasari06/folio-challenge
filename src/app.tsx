import React, { useState, useEffect } from "react";
import {
  Button,
  Rows,
  Text,
  Title,
  Alert,
  Box,
  LoadingIndicator,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
  Accordion,
  AccordionItem,
  CheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  EyeIcon,
} from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import { getCurrentPageContext } from "@canva/design";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "styles/components.css";
import { QAIssue, QAReport } from "./types/qa-types";
import { qaAnalysisService } from "./services/qa-analysis-service";
import { createAnalysisRequest, initializeSelectionListeners } from "./utils/design-utils";

export const App = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qaReport, setQaReport] = useState<QAReport | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [hasDesignContent, setHasDesignContent] = useState(false);
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    console.log("🚀 Design QA Agent initializing...");
    
    // Initialize selection listeners for real element analysis
    initializeSelectionListeners();
    
    checkDesignContent();
  }, []);

  const checkDesignContent = async () => {
    try {
      const context = await getCurrentPageContext();
      setHasDesignContent(context.dimensions ? context.dimensions.width > 0 : false);
    } catch (error) {
      console.log("Unable to get design context");
      setHasDesignContent(false);
    }
  };

  const runQAAnalysis = async () => {
    console.log("🔍 Starting QA Analysis...");
    setIsAnalyzing(true);
    
    try {
      // Create analysis request using real design data
      console.log("📊 Creating analysis request...");
      const analysisRequest = await createAnalysisRequest();
      console.log("📤 Analysis request created:", analysisRequest);
      
      // Send to our QA analysis service
      console.log("🌐 Sending to backend...");
      const response = await qaAnalysisService.analyzeDesign(analysisRequest);
      console.log("📥 Backend response:", response);
      
      if (response.success) {
        console.log("✅ Analysis successful, updating UI...");
        setQaReport(response.report);
        setHasRunAnalysis(true); // Mark that analysis has been run
      } else {
        console.error("❌ QA Analysis failed:", response.error);
        // Show error state here
      }
    } catch (error) {
      console.error("💥 QA Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
      console.log("🏁 Analysis complete");
    }
  };

  const getSeverityColor = (severity: string): "critical" | "warn" | "info" | "assist" => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'critical';
      case 'medium': return 'warn';
      case 'low': return 'info';
      default: return 'assist';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangleIcon />;
      case 'medium':
        return <InfoIcon />;
      case 'low':
        return <EyeIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getScoreColor = (score: number): "primary" | "secondary" | "tertiary" | "critical" => {
    if (score >= 90) return 'primary';
    if (score >= 70) return 'secondary';
    return 'critical';
  };

  const openExternalUrl = async (url: string) => {
    await requestOpenExternalUrl({ url });
  };

  if (!hasDesignContent) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="3u">
          <Box padding="3u" background="neutral" borderRadius="standard">
            <Rows spacing="2u">
              <Title size="medium">Design QA Agent</Title>
              <Text>
                Welcome! This app analyzes your Canva designs for accessibility, 
                visual consistency, and design best practices.
              </Text>
              <Alert tone="info" title="No design detected">
                Please create or open a design with content to begin the QA analysis.
              </Alert>
            </Rows>
          </Box>
        </Rows>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* Header */}
        <Box padding="2u">
          <Rows spacing="1u">
            <Title size="medium">Design QA Agent</Title>
            <Text size="small" tone="tertiary">
              AI-powered design analysis and recommendations
            </Text>
          </Rows>
        </Box>

        {/* Instructions - only show if analysis hasn't been run yet */}
        {!hasRunAnalysis && (
          <Box padding="2u">
            <Alert tone="info">
              <Rows spacing="1u">
                <Text size="small">
                  <strong>💡 How to use this tool:</strong>
                </Text>
                <Text size="small">
                  1. <strong>Select elements</strong> in your design (text, images) to analyze real content
                </Text>
                <Text size="small">
                  2. Click "Run Design QA Analysis" to check for accessibility and quality issues
                </Text>
                <Text size="small">
                  3. Review the results and apply suggested improvements
                </Text>
                <Text size="small" tone="tertiary">
                  💡 No selection = demonstration mode with sample issues
                </Text>
              </Rows>
            </Alert>
          </Box>
        )}

        {/* Main Action */}
        {!qaReport ? (
          <Button 
            variant="primary" 
            onClick={runQAAnalysis} 
            disabled={isAnalyzing}
            loading={isAnalyzing}
            stretch
          >
            {isAnalyzing ? "Analyzing design..." : "Run Design QA Analysis"}
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            onClick={runQAAnalysis} 
            disabled={isAnalyzing}
            loading={isAnalyzing}
            stretch
          >
            {isAnalyzing ? "Re-analyzing..." : "Run New Analysis"}
          </Button>
        )}

        {/* Results */}
        {qaReport && (
          <>
            {/* Score Overview */}
            <Box padding="2u" background="neutral" borderRadius="standard">
              <Rows spacing="2u">
                <Title size="small">Overall Design Score</Title>
                <Box>
                  <ProgressBar 
                    value={qaReport.overallScore} 
                    size="medium"
                  />
                  <Text size="large" variant="bold" tone={getScoreColor(qaReport.overallScore)}>
                    {qaReport.overallScore}/100
                  </Text>
                </Box>
                <Rows spacing="1u">
                  <Text size="small">
                    <span style={{ color: 'green' }}>✓ {qaReport.passed} checks passed</span> • 
                    <span style={{ color: 'red' }}> ✗ {qaReport.failed} issues found</span>
                  </Text>
                </Rows>
              </Rows>
            </Box>

            {/* Detailed Results Tabs */}
            <Tabs defaultActiveId="overview">
              <TabList>
                <Tab id="overview">Overview</Tab>
                <Tab id="issues">
                  Issues 
                  <Badge text={qaReport.totalIssues.toString()} tone="critical" />
                </Tab>
                <Tab id="ai-insights">AI Insights</Tab>
                <Tab id="recommendations">Tips</Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel id="overview">
                  <Rows spacing="2u">
                    <Title size="small">Quick Summary</Title>
                    <Alert 
                      tone={qaReport.overallScore >= 80 ? "positive" : "warn"}
                      title={qaReport.overallScore >= 80 ? "Good design quality!" : "Room for improvement"}
                    >
                      {qaReport.overallScore >= 80 
                        ? "Your design follows most best practices. Check the issues tab for minor improvements."
                        : `${qaReport.totalIssues} issues detected that could improve your design's accessibility and visual appeal.`
                      }
                    </Alert>
                    
                    <Box>
                      <Text size="small" variant="bold">Issues by Category:</Text>
                      <Rows spacing="1u">
                        {['contrast', 'alignment', 'spacing', 'typography', 'accessibility'].map(category => {
                          const count = qaReport.issues.filter(issue => issue.type === category).length;
                          return count > 0 ? (
                            <Text key={category} size="small">
                              {category.charAt(0).toUpperCase() + category.slice(1)}: {count} issue{count !== 1 ? 's' : ''}
                            </Text>
                          ) : null;
                        })}
                      </Rows>
                    </Box>
                  </Rows>
                </TabPanel>

                {/* Issues Tab */}
                <TabPanel id="issues">
                  <Rows spacing="2u">
                    <Title size="small">Detailed Issues</Title>
                    <Accordion>
                      {qaReport.issues.map((issue) => (
                        <AccordionItem
                          key={issue.id}
                          title={`${issue.title} - ${issue.severity.toUpperCase()}`}
                        >
                          <Rows spacing="1u">
                            <Text size="small" variant="bold">Problem:</Text>
                            <Text size="small">{issue.description}</Text>
                            <Text size="small" variant="bold">Recommendation:</Text>
                            <Text size="small" tone="secondary">{issue.suggestion}</Text>
                          </Rows>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Rows>
                </TabPanel>

                {/* AI Insights Tab */}
                <TabPanel id="ai-insights">
                  <Rows spacing="2u">
                    <Title size="small">AI-Powered Analysis</Title>
                    {qaReport.aiAnalysis ? (
                      qaReport.aiAnalysis.ai_enabled ? (
                        <Rows spacing="3u">
                          {/* AI Summary */}
                          <Box>
                            <Text size="small" variant="bold">AI Summary:</Text>
                            <Alert tone="info" title="Design Assessment">
                              {qaReport.aiAnalysis.summary}
                            </Alert>
                          </Box>

                          {/* AI Suggestions */}
                          {qaReport.aiAnalysis.suggestions && qaReport.aiAnalysis.suggestions.length > 0 && (
                            <Box>
                              <Text size="small" variant="bold">AI-Generated Suggestions:</Text>
                              <Rows spacing="1u">
                                {qaReport.aiAnalysis.suggestions.map((suggestion, index) => (
                                  <Alert key={index} tone="positive" title={`Suggestion ${index + 1}`}>
                                    {suggestion}
                                  </Alert>
                                ))}
                              </Rows>
                            </Box>
                          )}

                          {/* AI Overall Feedback */}
                          <Box>
                            <Text size="small" variant="bold">Detailed AI Feedback:</Text>
                            <Text size="small" tone="secondary">
                              {qaReport.aiAnalysis.overall_feedback}
                            </Text>
                          </Box>

                          {/* Design Principles */}
                          {qaReport.aiAnalysis.design_principles && qaReport.aiAnalysis.design_principles.length > 0 && (
                            <Box>
                              <Text size="small" variant="bold">Design Principles:</Text>
                              <Rows spacing="1u">
                                {qaReport.aiAnalysis.design_principles.map((principle, index) => (
                                  <Text key={index} size="small">
                                    • {principle}
                                  </Text>
                                ))}
                              </Rows>
                            </Box>
                          )}
                        </Rows>
                      ) : (
                        <Alert tone="warn" title="AI Analysis Disabled">
                          {qaReport.aiAnalysis.summary}
                          <br />
                          <Text size="small" tone="secondary">
                            To enable AI-powered insights, add your Gemini API key to the backend configuration.
                          </Text>
                        </Alert>
                      )
                    ) : (
                      <Alert tone="info" title="AI Analysis Unavailable">
                        AI analysis data is not available for this report.
                      </Alert>
                    )}
                  </Rows>
                </TabPanel>

                {/* Recommendations Tab */}
                <TabPanel id="recommendations">
                  <Rows spacing="2u">
                    <Title size="small">Design Best Practices</Title>
                    <Alert tone="info" title="Pro Tips">
                      Use these guidelines to create more effective designs.
                    </Alert>
                    
                    <Accordion>
                      <AccordionItem title="Color & Contrast">
                        <Text size="small">
                          • Maintain 4.5:1 contrast ratio for normal text<br/>
                          • Use 3:1 ratio for large text (18pt+)<br/>
                          • Test colors with accessibility tools<br/>
                          • Consider color-blind users
                        </Text>
                      </AccordionItem>
                      
                      <AccordionItem title="Typography">
                        <Text size="small">
                          • Limit to 2-3 font families maximum<br/>
                          • Use consistent text hierarchy<br/>
                          • Ensure readability at all sizes<br/>
                          • Maintain proper line spacing
                        </Text>
                      </AccordionItem>
                      
                      <AccordionItem title="Layout & Spacing">
                        <Text size="small">
                          • Follow the 8px grid system<br/>
                          • Align elements consistently<br/>
                          • Use white space effectively<br/>
                          • Group related elements together
                        </Text>
                      </AccordionItem>
                    </Accordion>
                    
                    <Button 
                      variant="tertiary" 
                      onClick={() => openExternalUrl("https://www.canva.dev/docs/apps/design-guidelines")}
                    >
                      View Canva Design Guidelines
                    </Button>
                  </Rows>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}

        {/* Footer */}
        <Box padding="2u" background="neutral" borderRadius="standard">
          <Text size="small" tone="tertiary">
            Powered by AI analysis • For support and feedback, contact the developer
          </Text>
        </Box>
      </Rows>
    </div>
  );
};
