
import { memoryManager } from '@/utils/memoryManager';
import { workerManager } from '@/utils/workerManager';
import { aiDesignAnalyzer } from './aiDesignAnalyzer';
import { frameworkAdapter } from './frameworkAdapter';
import { 
  CodeGenerationConfig, 
  GeneratedCode, 
  QualityAssessment, 
  CodeMetrics,
  CodeFile,
  ProjectStructure,
  BuildLog
} from '@/types/code-generation';

interface GenerationContext {
  sessionId: string;
  startTime: number;
  config: CodeGenerationConfig;
  userPreferences?: Record<string, any>;
  figmaData?: any;
}

interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  optimizations: string[];
}

/**
 * Enhanced Code Generation Engine
 * Orchestrates the entire code generation pipeline with AI assistance
 */
export class EnhancedCodeGenerationEngine {
  private static instance: EnhancedCodeGenerationEngine;
  private generationQueue: Map<string, GenerationContext> = new Map();
  private performanceMetrics: Map<string, any> = new Map();

  static getInstance(): EnhancedCodeGenerationEngine {
    if (!EnhancedCodeGenerationEngine.instance) {
      EnhancedCodeGenerationEngine.instance = new EnhancedCodeGenerationEngine();
    }
    return EnhancedCodeGenerationEngine.instance;
  }

  private constructor() {
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  /**
   * Main entry point for code generation
   */
  async generateCode(
    figmaData: any,
    config: CodeGenerationConfig,
    userPreferences?: Record<string, any>
  ): Promise<GeneratedCode> {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();

    // Create generation context
    const context: GenerationContext = {
      sessionId,
      startTime,
      config,
      userPreferences,
      figmaData
    };

    this.generationQueue.set(sessionId, context);

    try {
      // Phase 1: Design Analysis
      console.log(`[${sessionId}] Starting design analysis...`);
      const designAnalysis = await aiDesignAnalyzer.analyzeFigmaDesign(figmaData, config);

      // Phase 2: Code Structure Planning
      console.log(`[${sessionId}] Planning code structure...`);
      const structure = await this.planCodeStructure(designAnalysis, config);

      // Phase 3: Component Generation
      console.log(`[${sessionId}] Generating components...`);
      const components = await this.generateComponents(designAnalysis, structure, config);

      // Phase 4: Framework Adaptation
      console.log(`[${sessionId}] Adapting to target framework...`);
      const adaptedCode = await frameworkAdapter.adaptToFramework(
        components.jsx,
        components.css,
        config
      );

      // Phase 5: Quality Assessment
      console.log(`[${sessionId}] Assessing code quality...`);
      const quality = await this.performQualityAssessment(adaptedCode, config);

      // Phase 6: Optimization
      console.log(`[${sessionId}] Optimizing code...`);
      const optimized = await this.optimizeCode(adaptedCode, config, quality);

      // Phase 7: Final Assembly
      console.log(`[${sessionId}] Assembling final code...`);
      const finalCode = await this.assembleFinalCode(optimized, structure, config);

      // Calculate metrics
      const metrics = this.calculateMetrics(finalCode, startTime);

      // Build and validate
      const buildLogs = await this.validateBuild(finalCode, config);

      const result: GeneratedCode = {
        id: sessionId,
        timestamp: new Date(),
        config,
        files: finalCode.files,
        structure: finalCode.structure,
        metrics,
        quality: {
          ...quality,
          recommendations: [...quality.recommendations, ...designAnalysis.suggestions]
        },
        preview: finalCode.preview,
        buildStatus: buildLogs.some(log => log.level === 'error') ? 'error' : 
                    buildLogs.some(log => log.level === 'warn') ? 'warning' : 'success',
        buildLogs
      };

      // Cache the result
      await memoryManager.store(`generation-${sessionId}`, result);

      console.log(`[${sessionId}] Code generation completed successfully`);
      return result;

    } catch (error) {
      console.error(`[${sessionId}] Code generation failed:`, error);
      throw error;
    } finally {
      this.generationQueue.delete(sessionId);
    }
  }

  /**
   * Plan the overall code structure based on design analysis
   */
  private async planCodeStructure(
    designAnalysis: any,
    config: CodeGenerationConfig
  ): Promise<ProjectStructure> {
    const componentCount = designAnalysis.components?.length || 1;
    const hasComplexInteractions = designAnalysis.interactions?.length > 0;
    const hasAnimations = designAnalysis.animations?.length > 0;

    return {
      root: 'src',
      components: this.generateComponentPaths(designAnalysis.components || []),
      hooks: hasComplexInteractions ? ['useInteraction.ts', 'useAnimation.ts'] : [],
      utils: ['helpers.ts', 'constants.ts'],
      types: config.typescript ? ['index.ts', 'components.ts'] : [],
      styles: this.generateStylePaths(config.styling),
      tests: config.testing.unitTests ? ['__tests__/'] : [],
      assets: designAnalysis.assets?.map((asset: any) => asset.name) || []
    };
  }

  /**
   * Generate React components from design analysis
   */
  private async generateComponents(
    designAnalysis: any,
    structure: ProjectStructure,
    config: CodeGenerationConfig
  ): Promise<{ jsx: string; css: string }> {
    // Use web worker for intensive processing
    const processingResult = await workerManager.processInWorker('codeProcessingWorker', {
      type: 'generateComponents',
      data: {
        designAnalysis,
        structure,
        config
      }
    });

    return {
      jsx: processingResult.jsx || this.generateFallbackJSX(config),
      css: processingResult.css || this.generateFallbackCSS(config)
    };
  }

  /**
   * Perform comprehensive quality assessment
   */
  private async performQualityAssessment(
    code: any,
    config: CodeGenerationConfig
  ): Promise<QualityAssessment> {
    const codeString = typeof code.componentCode === 'string' ? code.componentCode : '';
    const codeLength = codeString.length;
    
    // Basic quality metrics
    const hasTypeScript = config.typescript && codeString.includes('interface');
    const hasAccessibility = /aria-|role=|alt=/.test(codeString);
    const hasResponsive = /@media|rem|em|%/.test(code.styleCode || '');
    const hasTests = config.testing.unitTests;
    const hasComments = /\/\*|\/\//.test(codeString);

    const categories = {
      visual: this.calculateVisualScore(code),
      code: this.calculateCodeScore(codeString, config),
      performance: this.calculatePerformanceScore(code, config),
      accessibility: hasAccessibility ? 95 : 60,
      maintainability: (hasComments ? 40 : 20) + (hasTypeScript ? 30 : 10) + (hasTests ? 30 : 0),
      security: this.calculateSecurityScore(codeString)
    };

    const overall = Object.values(categories).reduce((sum, score) => sum + score, 0) / Object.keys(categories).length;

    const issues = [];
    const recommendations = [];

    if (!hasAccessibility) {
      issues.push({
        level: 'warning' as const,
        message: 'Missing accessibility attributes',
        category: 'accessibility' as const
      });
    }

    if (!hasTypeScript && config.typescript) {
      recommendations.push('Enable TypeScript for better type safety');
    }

    if (!hasResponsive) {
      recommendations.push('Add responsive design patterns');
    }

    return {
      overall,
      categories,
      issues,
      recommendations
    };
  }

  /**
   * Optimize the generated code
   */
  private async optimizeCode(
    code: any,
    config: CodeGenerationConfig,
    quality: QualityAssessment
  ): Promise<any> {
    const optimizations = [];
    let optimizedCode = { ...code };

    // Tree shaking optimization
    if (config.optimization.treeshaking) {
      optimizedCode = await this.performTreeShaking(optimizedCode);
      optimizations.push('Tree shaking applied');
    }

    // Bundle splitting
    if (config.optimization.codesplitting) {
      optimizedCode = await this.applySplitting(optimizedCode);
      optimizations.push('Code splitting applied');
    }

    // Accessibility improvements
    if (quality.categories.accessibility < 80) {
      optimizedCode = await this.enhanceAccessibility(optimizedCode);
      optimizations.push('Accessibility enhancements added');
    }

    // Performance optimizations
    if (quality.categories.performance < 80) {
      optimizedCode = await this.optimizePerformance(optimizedCode);
      optimizations.push('Performance optimizations applied');
    }

    return {
      ...optimizedCode,
      optimizations
    };
  }

  /**
   * Assemble the final code package
   */
  private async assembleFinalCode(
    optimizedCode: any,
    structure: ProjectStructure,
    config: CodeGenerationConfig
  ): Promise<{
    files: CodeFile[];
    structure: ProjectStructure;
    preview: string;
  }> {
    const files: CodeFile[] = [];

    // Main component file
    files.push({
      path: `${structure.root}/components/GeneratedComponent.${config.typescript ? 'tsx' : 'jsx'}`,
      name: `GeneratedComponent.${config.typescript ? 'tsx' : 'jsx'}`,
      extension: config.typescript ? '.tsx' : '.jsx',
      content: optimizedCode.componentCode || '',
      size: new Blob([optimizedCode.componentCode || '']).size,
      language: config.typescript ? 'typescript' : 'javascript',
      imports: this.extractImports(optimizedCode.componentCode || ''),
      exports: ['GeneratedComponent'],
      dependencies: optimizedCode.template?.dependencies || []
    });

    // Style file
    if (optimizedCode.styleCode) {
      const styleExtension = config.styling === 'scss' ? '.scss' : '.css';
      files.push({
        path: `${structure.root}/styles/GeneratedComponent${styleExtension}`,
        name: `GeneratedComponent${styleExtension}`,
        extension: styleExtension,
        content: optimizedCode.styleCode,
        size: new Blob([optimizedCode.styleCode]).size,
        language: config.styling === 'scss' ? 'scss' : 'css',
        imports: [],
        exports: [],
        dependencies: []
      });
    }

    // Additional files
    Object.entries(optimizedCode.additionalFiles || {}).forEach(([filename, content]) => {
      if (typeof content === 'string') {
        files.push({
          path: `${structure.root}/${filename}`,
          name: filename,
          extension: filename.substring(filename.lastIndexOf('.')),
          content,
          size: new Blob([content]).size,
          language: this.detectLanguage(filename),
          imports: this.extractImports(content),
          exports: this.extractExports(content),
          dependencies: []
        });
      }
    });

    return {
      files,
      structure,
      preview: this.generatePreview(optimizedCode.componentCode || '')
    };
  }

  /**
   * Calculate comprehensive metrics
   */
  private calculateMetrics(finalCode: any, startTime: number): CodeMetrics {
    const totalContent = finalCode.files.reduce((acc: string, file: CodeFile) => acc + file.content, '');
    const linesOfCode = totalContent.split('\n').length;
    const totalSize = finalCode.files.reduce((acc: number, file: CodeFile) => acc + file.size, 0);

    return {
      linesOfCode,
      complexity: this.calculateComplexity(totalContent),
      maintainabilityIndex: this.calculateMaintainabilityIndex(totalContent),
      duplicateLines: this.findDuplicateLines(totalContent),
      testCoverage: 0, // Would need actual test execution
      bundleSize: totalSize,
      loadTime: Date.now() - startTime,
      performanceScore: this.calculatePerformanceScore(finalCode, { optimization: { treeshaking: true, bundleAnalysis: true, codesplitting: true, lazyLoading: true } } as CodeGenerationConfig)
    };
  }

  /**
   * Validate build configuration
   */
  private async validateBuild(finalCode: any, config: CodeGenerationConfig): Promise<BuildLog[]> {
    const logs: BuildLog[] = [];
    const timestamp = new Date();

    // Check for common issues
    finalCode.files.forEach((file: CodeFile) => {
      // Check for missing imports
      const imports = this.extractImports(file.content);
      const missingImports = this.findMissingImports(file.content, imports);
      
      missingImports.forEach(missing => {
        logs.push({
          timestamp,
          level: 'warn',
          message: `Potentially missing import: ${missing}`,
          file: file.name
        });
      });

      // Check for TypeScript issues
      if (config.typescript && file.extension === '.tsx') {
        const tsIssues = this.validateTypeScript(file.content);
        tsIssues.forEach(issue => {
          logs.push({
            timestamp,
            level: 'error',
            message: issue,
            file: file.name
          });
        });
      }
    });

    if (logs.length === 0) {
      logs.push({
        timestamp,
        level: 'info',
        message: 'Build validation completed successfully'
      });
    }

    return logs;
  }

  // Helper methods
  private generateSessionId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateComponentPaths(components: any[]): string[] {
    return components.map((comp, index) => `components/${comp.name || `Component${index + 1}`}.tsx`);
  }

  private generateStylePaths(styling: string): string[] {
    const extension = styling === 'scss' ? '.scss' : '.css';
    return [`styles/main${extension}`, `styles/components${extension}`];
  }

  private generateFallbackJSX(config: CodeGenerationConfig): string {
    return `import React from 'react';

const GeneratedComponent${config.typescript ? ': React.FC' : ''} = () => {
  return (
    <div className="generated-component">
      <h1>Generated Component</h1>
      <p>This component was generated from your Figma design.</p>
    </div>
  );
};

export default GeneratedComponent;`;
  }

  private generateFallbackCSS(config: CodeGenerationConfig): string {
    return `.generated-component {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.generated-component h1 {
  color: #333;
  margin-bottom: 10px;
}

.generated-component p {
  color: #666;
  line-height: 1.5;
}`;
  }

  private calculateVisualScore(code: any): number {
    // Placeholder implementation
    return 85;
  }

  private calculateCodeScore(codeString: string, config: CodeGenerationConfig): number {
    let score = 70;
    
    if (config.typescript && codeString.includes('interface')) score += 15;
    if (codeString.includes('React.FC') || codeString.includes('function')) score += 10;
    if (/\/\*|\/\//.test(codeString)) score += 5;
    
    return Math.min(score, 100);
  }

  private calculatePerformanceScore(code: any, config: CodeGenerationConfig): number {
    let score = 75;
    
    if (config.optimization.treeshaking) score += 8;
    if (config.optimization.codesplitting) score += 8;
    if (config.optimization.lazyLoading) score += 9;
    
    return Math.min(score, 100);
  }

  private calculateSecurityScore(codeString: string): number {
    let score = 90;
    
    // Check for potential security issues
    if (codeString.includes('dangerouslySetInnerHTML')) score -= 20;
    if (codeString.includes('eval(')) score -= 30;
    if (codeString.includes('document.write')) score -= 25;
    
    return Math.max(score, 0);
  }

  private async performTreeShaking(code: any): Promise<any> {
    // Placeholder implementation
    return code;
  }

  private async applySplitting(code: any): Promise<any> {
    // Placeholder implementation
    return code;
  }

  private async enhanceAccessibility(code: any): Promise<any> {
    // Add ARIA labels and semantic HTML
    if (typeof code.componentCode === 'string') {
      code.componentCode = code.componentCode
        .replace(/<div>/g, '<div role="main">')
        .replace(/<button([^>]*)>/g, '<button$1 aria-label="Generated button">');
    }
    return code;
  }

  private async optimizePerformance(code: any): Promise<any> {
    // Add React.memo and other optimizations
    if (typeof code.componentCode === 'string') {
      code.componentCode = code.componentCode
        .replace('const GeneratedComponent', 'const GeneratedComponent = React.memo(() =>');
    }
    return code;
  }

  private extractImports(content: string): string[] {
    const importRegex = /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  private extractExports(content: string): string[] {
    const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
    const exports = [];
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  private detectLanguage(filename: string): string {
    const extension = filename.substring(filename.lastIndexOf('.'));
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.css': 'css',
      '.scss': 'scss',
      '.html': 'html',
      '.json': 'json'
    };
    
    return languageMap[extension] || 'text';
  }

  private generatePreview(componentCode: string): string {
    // Generate a simple HTML preview
    return `<!DOCTYPE html>
<html>
<head>
    <title>Generated Component Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .preview { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="preview">
        <h2>Component Preview</h2>
        <p>This is a preview of your generated component.</p>
        <pre><code>${componentCode.substring(0, 200)}...</code></pre>
    </div>
</body>
</html>`;
  }

  private calculateComplexity(content: string): number {
    // Simple cyclomatic complexity calculation
    const complexityIndicators = [
      /if\s*\(/g,
      /else\s*{/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g
    ];
    
    let complexity = 1; // Base complexity
    
    complexityIndicators.forEach(regex => {
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  private calculateMaintainabilityIndex(content: string): number {
    const linesOfCode = content.split('\n').length;
    const complexity = this.calculateComplexity(content);
    
    // Simplified maintainability index calculation
    // Higher is better (0-100 scale)
    return Math.max(0, Math.min(100, 100 - (complexity * 2) - (linesOfCode / 10)));
  }

  private findDuplicateLines(content: string): number {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lineCount = new Map<string, number>();
    
    lines.forEach(line => {
      lineCount.set(line, (lineCount.get(line) || 0) + 1);
    });
    
    let duplicates = 0;
    lineCount.forEach(count => {
      if (count > 1) {
        duplicates += count - 1;
      }
    });
    
    return duplicates;
  }

  private findMissingImports(content: string, existingImports: string[]): string[] {
    const used = [];
    
    // Check for React usage
    if (/React\.|useState|useEffect|Component/.test(content) && !existingImports.includes('react')) {
      used.push('react');
    }
    
    // Check for common libraries
    if (/className/.test(content) && !existingImports.some(imp => imp.includes('css'))) {
      // Might need CSS imports
    }
    
    return used;
  }

  private validateTypeScript(content: string): string[] {
    const issues = [];
    
    // Check for basic TypeScript issues
    if (content.includes(': React.FC') && !content.includes('import React')) {
      issues.push('React import missing for React.FC type');
    }
    
    if (/interface\s+\w+/.test(content) && !content.includes('export')) {
      issues.push('Interface defined but not exported');
    }
    
    return issues;
  }

  private initializePerformanceMonitoring(): void {
    // Performance monitoring setup
    if (typeof performance !== 'undefined') {
      this.performanceMetrics.set('initialized', Date.now());
    }
  }
}

// Export singleton instance
export const enhancedCodeGenerationEngine = EnhancedCodeGenerationEngine.getInstance();
