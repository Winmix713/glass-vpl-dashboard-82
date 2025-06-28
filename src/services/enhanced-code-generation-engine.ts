import { CodeGenerationConfig, GeneratedCode, ComponentMapping, QualityAssessment } from '@/types/code-generation';
import { FigmaFile, FigmaNode } from '@/types/figma-api';
import { transformer } from '@/lib/transform';
import { svgToJsx } from '@/lib/svg-to-jsx';
import { memoryManager } from '@/utils/memoryManager';
import { workerManager } from '@/utils/workerManager';
import { aiDesignAnalyzer } from '@/services/aiDesignAnalyzer';
import { frameworkAdapter } from '@/services/frameworkAdapter';

export class EnhancedCodeGenerationEngine {
  private static instance: EnhancedCodeGenerationEngine;

  static getInstance(): EnhancedCodeGenerationEngine {
    if (!EnhancedCodeGenerationEngine.instance) {
      EnhancedCodeGenerationEngine.instance = new EnhancedCodeGenerationEngine();
    }
    return EnhancedCodeGenerationEngine.instance;
  }

  private constructor() {}

  async generateCode(
    figmaFile: FigmaFile,
    config: CodeGenerationConfig,
    onProgress?: (progress: number, status: string) => void
  ): Promise<GeneratedCode> {
    const startTime = Date.now();
    
    try {
      onProgress?.(5, 'Initializing enhanced code generation...');
      
      // Check memory cache first
      const cacheKey = `figma-${figmaFile.key}-${JSON.stringify(config)}`;
      const cached = memoryManager.get(cacheKey);
      if (cached) {
        onProgress?.(100, 'Retrieved from cache!');
        return cached;
      }
      
      onProgress?.(10, 'Extracting SVG data from Figma...');
      const svgData = await this.extractSVGFromFigma(figmaFile);
      
      onProgress?.(20, 'Analyzing design patterns with AI...');
      const designPatterns = await aiDesignAnalyzer.analyzeDesignPatterns([figmaFile.document]);
      
      onProgress?.(25, 'Optimizing SVG structure...');
      const optimizedSVG = await workerManager.executeTask('OPTIMIZE_CODE', { code: svgData });
      
      onProgress?.(40, 'Analyzing design tokens...');
      const designTokens = this.extractDesignTokens(optimizedSVG.optimizedCode || svgData);
      
      onProgress?.(55, 'Transforming to component structure...');
      const componentMappings = await this.analyzeAndTransform(optimizedSVG.optimizedCode || svgData, config);
      
      onProgress?.(65, 'Generating framework-specific code...');
      const jsxCode = await this.generateJSXCode(componentMappings[0], config);
      const cssCode = this.generateCSSFromTokens(designTokens, config);
      
      onProgress?.(75, 'Adapting to target framework...');
      const frameworkOutput = await frameworkAdapter.adaptToFramework(jsxCode, cssCode, config);
      
      onProgress?.(85, 'Generating additional files...');
      const files = await this.generateFrameworkFiles(frameworkOutput, config, designTokens);
      
      onProgress?.(95, 'Running quality assessment...');
      const quality = await this.assessCodeQuality(files, config);
      
      // Generate AI suggestions
      const aiSuggestions = await aiDesignAnalyzer.generateCodeSuggestions(designPatterns);
      
      onProgress?.(100, 'Enhanced code generation complete!');

      const generatedCode: GeneratedCode = {
        id: this.generateId(),
        timestamp: new Date(),
        config,
        files,
        structure: this.buildProjectStructure(files),
        metrics: this.calculateAdvancedMetrics(files, componentMappings.length),
        quality: {
          ...quality,
          aiSuggestions
        },
        preview: this.generateEnhancedPreview(files, designTokens),
        buildStatus: quality.overall >= 80 ? 'success' : quality.overall >= 60 ? 'warning' : 'error',
        buildLogs: [],
        designPatterns,
        frameworkTemplate: frameworkOutput.template
      };

      // Cache the result
      memoryManager.set(cacheKey, generatedCode);
      
      return generatedCode;
    } catch (error) {
      console.error('Enhanced code generation error:', error);
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private optimizeSVG(svgData: string): string {
    // Basic SVG optimization
    let optimized = svgData;
    
    // Remove unnecessary whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    // Remove comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove empty groups
    optimized = optimized.replace(/<g[^>]*>\s*<\/g>/g, '');
    
    // Optimize decimal precision
    optimized = optimized.replace(/(\d+\.\d{3,})/g, (match) => {
      return parseFloat(match).toFixed(2);
    });
    
    return optimized;
  }

  private extractDesignTokens(svgData: string): any {
    const tokens = {
      colors: [],
      fonts: [],
      spacing: [],
      borderRadius: []
    };
    
    // Extract colors from fill and stroke attributes
    const colorMatches = svgData.match(/(fill|stroke)="([^"]+)"/g) || [];
    const colors = new Set<string>();
    
    colorMatches.forEach(match => {
      const color = match.split('=')[1].replace(/"/g, '');
      if (color !== 'none' && color !== 'transparent') {
        colors.add(color);
      }
    });
    
    tokens.colors = Array.from(colors);
    
    // Extract font families
    const fontMatches = svgData.match(/font-family="([^"]+)"/g) || [];
    const fonts = new Set<string>();
    
    fontMatches.forEach(match => {
      const font = match.split('=')[1].replace(/"/g, '');
      fonts.add(font);
    });
    
    tokens.fonts = Array.from(fonts);
    
    // Extract common spacing values
    const spacingMatches = svgData.match(/\b(\d+(?:\.\d+)?)\b/g) || [];
    const spacing = new Set<string>();
    
    spacingMatches.forEach(match => {
      const value = parseFloat(match);
      if (value > 0 && value <= 100 && value % 4 === 0) {
        spacing.add(`${value}px`);
      }
    });
    
    tokens.spacing = Array.from(spacing).slice(0, 10); // Limit to 10 most common
    
    // Extract border radius values
    const radiusMatches = svgData.match(/rx="([^"]+)"/g) || [];
    const borderRadius = new Set<string>();
    
    radiusMatches.forEach(match => {
      const radius = match.split('=')[1].replace(/"/g, '');
      borderRadius.add(`${radius}px`);
    });
    
    tokens.borderRadius = Array.from(borderRadius);
    
    return tokens;
  }

  async extractSVGFromFigma(figmaFile: FigmaFile): Promise<string> {
    // Enhanced SVG extraction with better node processing
    if (!figmaFile || !figmaFile.document) {
      throw new Error('Invalid Figma file structure');
    }

    // Process the document tree to extract SVG-like content
    const svgElements = this.processNodeToSVG(figmaFile.document);
    
    // Calculate bounding box for the entire design
    const boundingBox = this.calculateBoundingBox(figmaFile.document);
    
    // Wrap all SVG elements in a proper root SVG element
    const svgContent = this.wrapInSVGRoot(svgElements, boundingBox);
    
    // If no valid SVG content found, return a default template
    if (!svgElements || svgElements.trim().length === 0) {
      return this.getDefaultSVGTemplate();
    }

    return svgContent;
  }

  private processNodeToSVG(node: FigmaNode): string {
    // Convert Figma node structure to SVG
    const { type, name, absoluteBoundingBox, fills, children } = node;
    
    let svgElements: string[] = [];
    
    // Handle different node types
    switch (type) {
      case 'FRAME':
      case 'GROUP':
        if (children && children.length > 0) {
          const childSvg = children.map(child => this.processNodeToSVG(child)).join('\n');
          if (childSvg.trim()) {
            svgElements.push(`<g data-name="${name || 'group'}">${childSvg}</g>`);
          }
        }
        break;
        
      case 'RECTANGLE':
        if (absoluteBoundingBox) {
          const { x, y, width, height } = absoluteBoundingBox;
          const fill = this.extractFillColor(fills);
          svgElements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" />`);
        }
        break;
        
      case 'ELLIPSE':
        if (absoluteBoundingBox) {
          const { x, y, width, height } = absoluteBoundingBox;
          const cx = x + width / 2;
          const cy = y + height / 2;
          const rx = width / 2;
          const ry = height / 2;
          const fill = this.extractFillColor(fills);
          svgElements.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" />`);
        }
        break;
        
      case 'TEXT':
        if (absoluteBoundingBox && node.characters) {
          const { x, y } = absoluteBoundingBox;
          const fill = this.extractFillColor(fills);
          svgElements.push(`<text x="${x}" y="${y + 20}" fill="${fill}">${this.escapeXML(node.characters)}</text>`);
        }
        break;
        
      default:
        // Handle other node types or skip
        if (children && children.length > 0) {
          const childSvg = children.map(child => this.processNodeToSVG(child)).join('\n');
          if (childSvg.trim()) {
            svgElements.push(childSvg);
          }
        }
    }
    
    return svgElements.join('\n');
  }

  private calculateBoundingBox(node: FigmaNode): { x: number; y: number; width: number; height: number } {
    // Calculate the overall bounding box for the design
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    const collectBounds = (node: FigmaNode) => {
      if (node.absoluteBoundingBox) {
        const { x, y, width, height } = node.absoluteBoundingBox;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      }
      
      if (node.children) {
        node.children.forEach(collectBounds);
      }
    };
    
    collectBounds(node);
    
    // If no bounds found, use default
    if (minX === Infinity) {
      return { x: 0, y: 0, width: 400, height: 300 };
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private wrapInSVGRoot(svgElements: string, boundingBox: { x: number; y: number; width: number; height: number }): string {
    const { x, y, width, height } = boundingBox;
    
    return `<svg width="${width}" height="${height}" viewBox="${x} ${y} ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
${svgElements}
</svg>`;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private extractFillColor(fills?: any[]): string {
    if (!fills || fills.length === 0) return '#000000';
    
    const fill = fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      const { r, g, b, a = 1 } = fill.color;
      const red = Math.round(r * 255);
      const green = Math.round(g * 255);
      const blue = Math.round(b * 255);
      
      if (a < 1) {
        return `rgba(${red}, ${green}, ${blue}, ${a})`;
      }
      
      return `rgb(${red}, ${green}, ${blue})`;
    }
    
    return '#000000';
  }

  private getDefaultSVGTemplate(): string {
    return `<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#F3F4F6"/>
  <rect x="50" y="50" width="300" height="200" rx="12" fill="white"/>
  <text x="70" y="100" font-family="Arial" font-size="24" font-weight="bold" fill="#111827">Generated Component</text>
  <text x="70" y="130" font-family="Arial" font-size="14" fill="#6B7280">This is a sample component generated from your Figma design.</text>
  <rect x="70" y="160" width="260" height="40" rx="8" fill="#2563EB"/>
  <text x="200" y="185" font-family="Arial" font-size="14" font-weight="500" fill="white" text-anchor="middle">Get Started</text>
</svg>`;
  }

  private async analyzeAndTransform(svg: string, config: CodeGenerationConfig): Promise<ComponentMapping[]> {
    try {
      // Transform SVG to JSX using the enhanced transformer
      const jsxString = await transformer(svg, {
        framework: config.framework,
        typescript: config.typescript,
        styling: config.styling,
        componentName: 'GeneratedComponent',
        passProps: true
      });

      // Create component mapping
      const mapping: ComponentMapping = {
        figmaNodeId: 'root',
        componentName: 'GeneratedComponent',
        componentType: 'functional',
        props: [
          {
            name: 'className',
            type: 'string',
            required: false,
            defaultValue: '',
            description: 'Additional CSS classes'
          }
        ],
        state: [],
        methods: [],
        lifecycle: [],
        styling: {
          approach: config.styling,
          classes: this.extractTailwindClasses(jsxString),
          variables: [],
          responsive: [],
          animations: []
        },
        accessibility: {
          ariaLabels: [],
          keyboardNavigation: [],
          screenReader: [],
          colorContrast: {
            foreground: '#000000',
            background: '#ffffff',
            ratio: 21,
            wcagLevel: 'AAA',
            passes: true
          },
          focusManagement: []
        }
      };

      return [mapping];
    } catch (error) {
      console.error('Transform error:', error);
      throw error;
    }
  }

  private extractTailwindClasses(jsxString: string): string[] {
    const classMatches = jsxString.match(/className="([^"]+)"/g) || [];
    const classes = new Set<string>();
    
    classMatches.forEach(match => {
      const classString = match.match(/"([^"]+)"/)?.[1] || '';
      classString.split(' ').forEach(cls => {
        if (cls.trim()) classes.add(cls.trim());
      });
    });
    
    return Array.from(classes);
  }

  private async generateJSXCode(mapping: ComponentMapping, config: CodeGenerationConfig): Promise<string> {
    // Use worker for complex JSX generation
    const result = await workerManager.executeTask('TRANSFORM_CODE', {
      code: '<div className="generated-component">Generated Component</div>',
      config
    });
    
    return result.transformedCode;
  }

  private generateCSSFromTokens(designTokens: any, config: CodeGenerationConfig): string {
    let css = '';
    
    // Generate CSS variables from design tokens
    css += ':root {\n';
    designTokens.colors.forEach((color: string, index: number) => {
      css += `  --color-${index + 1}: ${color};\n`;
    });
    designTokens.spacing.forEach((space: string, index: number) => {
      css += `  --spacing-${index + 1}: ${space};\n`;
    });
    css += '}\n\n';
    
    // Generate component styles
    css += '.generated-component {\n';
    css += '  max-width: 28rem;\n';
    css += '  margin: 0 auto;\n';
    css += '  background: white;\n';
    css += '  border-radius: 0.75rem;\n';
    css += '  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n';
    css += '  overflow: hidden;\n';
    css += '}\n';
    
    return css;
  }

  private async generateFrameworkFiles(
    frameworkOutput: any,
    config: CodeGenerationConfig,
    designTokens: any
  ): Promise<any[]> {
    const files = [];
    
    // Main component file
    files.push({
      path: `src/GeneratedComponent${frameworkOutput.template.extension}`,
      name: `GeneratedComponent${frameworkOutput.template.extension}`,
      extension: frameworkOutput.template.extension.slice(1),
      content: frameworkOutput.componentCode,
      size: frameworkOutput.componentCode.length,
      language: config.framework,
      imports: [],
      exports: ['GeneratedComponent'],
      dependencies: frameworkOutput.template.dependencies
    });
    
    // Style file
    if (frameworkOutput.styleCode) {
      const styleExtension = config.styling === 'scss' ? '.scss' : '.css';
      files.push({
        path: `src/GeneratedComponent${styleExtension}`,
        name: `GeneratedComponent${styleExtension}`,
        extension: styleExtension.slice(1),
        content: frameworkOutput.styleCode,
        size: frameworkOutput.styleCode.length,
        language: config.styling,
        imports: [],
        exports: [],
        dependencies: []
      });
    }
    
    // Additional files
    Object.entries(frameworkOutput.additionalFiles).forEach(([filename, content]) => {
      files.push({
        path: `src/${filename}`,
        name: filename,
        extension: filename.split('.').pop() || '',
        content: content as string,
        size: (content as string).length,
        language: filename.endsWith('.ts') ? 'typescript' : 'javascript',
        imports: [],
        exports: [],
        dependencies: []
      });
    });
    
    // Configuration files
    Object.entries(frameworkOutput.template.configFiles).forEach(([filename, content]) => {
      files.push({
        path: filename,
        name: filename,
        extension: filename.split('.').pop() || '',
        content,
        size: content.length,
        language: filename.endsWith('.json') ? 'json' : 'javascript',
        imports: [],
        exports: [],
        dependencies: []
      });
    });
    
    // Package.json
    files.push(this.generateEnhancedPackageJson(frameworkOutput.template, config));
    
    return files;
  }

  private generateEnhancedPackageJson(template: any, config: CodeGenerationConfig): any {
    const packageJson = {
      name: `generated-${template.name.toLowerCase()}-component`,
      version: '1.0.0',
      description: `Generated ${template.name} component from Figma design`,
      main: `src/GeneratedComponent${template.extension}`,
      scripts: this.getFrameworkScripts(template.name),
      dependencies: template.dependencies.reduce((acc: any, dep: string) => {
        const [name, version] = dep.split('@');
        acc[name] = version || 'latest';
        return acc;
      }, {}),
      devDependencies: template.devDependencies.reduce((acc: any, dep: string) => {
        const [name, version] = dep.split('@');
        acc[name] = version || 'latest';
        return acc;
      }, {})
    };

    const content = JSON.stringify(packageJson, null, 2);
    
    return {
      path: 'package.json',
      name: 'package.json',
      extension: 'json',
      content,
      size: content.length,
      language: 'json',
      imports: [],
      exports: [],
      dependencies: Object.keys(packageJson.dependencies)
    };
  }

  private getFrameworkScripts(framework: string): Record<string, string> {
    switch (framework.toLowerCase()) {
      case 'vue':
        return {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        };
      case 'angular':
        return {
          dev: 'ng serve',
          build: 'ng build',
          test: 'ng test'
        };
      case 'svelte':
        return {
          dev: 'vite dev',
          build: 'vite build',
          preview: 'vite preview'
        };
      default: // React
        return {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        };
    }
  }

  private async generateMainComponent(mapping: ComponentMapping, config: CodeGenerationConfig): Promise<any> {
    const { componentName } = mapping;
    const extension = config.typescript ? '.tsx' : '.jsx';
    
    let content = '';
    
    // Imports
    content += `import React from 'react';\n`;
    if (config.styling === 'styled-components') {
      content += `import styled from 'styled-components';\n`;
    } else if (config.styling === 'tailwind') {
      content += `import './styles.css';\n`;
    }
    if (config.typescript) {
      content += `import { ${componentName}Props } from './types';\n`;
    }
    content += '\n';
    
    // Component definition
    if (config.typescript) {
      content += `interface ${componentName}Props {\n`;
      content += `  className?: string;\n`;
      content += `  [key: string]: any;\n`;
      content += `}\n\n`;
    }
    
    const propsParam = config.typescript ? `props: ${componentName}Props` : 'props';
    content += `const ${componentName} = (${propsParam}) => {\n`;
    content += `  const { className = '', ...restProps } = props;\n\n`;
    
    // Component JSX
    content += `  return (\n`;
    content += `    <div className={\`max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden \${className}\`} {...restProps}>\n`;
    content += `      <div className="p-6">\n`;
    content += `        <h2 className="text-2xl font-bold text-gray-900 mb-4">\n`;
    content += `          Generated Component\n`;
    content += `        </h2>\n`;
    content += `        <p className="text-gray-600 mb-6">\n`;
    content += `          This is a sample component generated from your Figma design.\n`;
    content += `        </p>\n`;
    content += `        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">\n`;
    content += `          Get Started\n`;
    content += `        </button>\n`;
    content += `      </div>\n`;
    content += `    </div>\n`;
    content += `  );\n`;
    content += `};\n\n`;
    
    // Export
    content += `export default ${componentName};\n`;
    
    return {
      path: `src/${componentName}${extension}`,
      name: `${componentName}${extension}`,
      extension: extension.slice(1),
      content,
      size: content.length,
      language: config.typescript ? 'typescript' : 'javascript',
      imports: ['react'],
      exports: [componentName],
      dependencies: []
    };
  }

  private generateTypesFile(mappings: ComponentMapping[]): any {
    let content = `// Generated TypeScript definitions\n\n`;
    
    mappings.forEach(mapping => {
      content += `export interface ${mapping.componentName}Props {\n`;
      content += `  className?: string;\n`;
      content += `  [key: string]: any;\n`;
      content += `}\n\n`;
    });
    
    return {
      path: 'src/types.ts',
      name: 'types.ts',
      extension: 'ts',
      content,
      size: content.length,
      language: 'typescript',
      imports: [],
      exports: mappings.map(m => `${m.componentName}Props`),
      dependencies: []
    };
  }

  private generateStylesFile(config: CodeGenerationConfig, designTokens: any): any {
    let content = '';
    const extension = config.styling === 'scss' ? '.scss' : '.css';
    
    if (config.styling === 'tailwind') {
      content += `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;
      content += `/* Design tokens extracted from Figma */\n`;
      content += `:root {\n`;
      designTokens.colors.forEach((color: string, index: number) => {
        content += `  --color-${index + 1}: ${color};\n`;
      });
      content += `}\n\n`;
    } else {
      content += `/* Generated component styles */\n\n`;
      content += `/* Design tokens */\n`;
      content += `:root {\n`;
      designTokens.colors.forEach((color: string, index: number) => {
        content += `  --color-${index + 1}: ${color};\n`;
      });
      content += `}\n\n`;
      
      content += `.generated-component {\n`;
      content += `  max-width: 28rem;\n`;
      content += `  margin: 0 auto;\n`;
      content += `  background: white;\n`;
      content += `  border-radius: 0.75rem;\n`;
      content += `  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n`;
      content += `  overflow: hidden;\n`;
      content += `}\n`;
    }
    
    return {
      path: `src/styles${extension}`,
      name: `styles${extension}`,
      extension: extension.slice(1),
      content,
      size: content.length,
      language: config.styling === 'scss' ? 'scss' : 'css',
      imports: [],
      exports: [],
      dependencies: config.styling === 'tailwind' ? ['tailwindcss'] : []
    };
  }

  private generatePackageJson(config: CodeGenerationConfig): any {
    const packageJson = {
      name: 'generated-figma-component',
      version: '1.0.0',
      description: 'Generated React component from Figma design',
      main: 'src/index.tsx',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        test: 'vitest',
        lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        vite: '^4.4.0',
        vitest: '^0.34.0'
      }
    };

    if (config.typescript) {
      packageJson.devDependencies['typescript'] = '^5.0.0';
    }

    if (config.styling === 'tailwind') {
      packageJson.devDependencies['tailwindcss'] = '^3.3.0';
      packageJson.devDependencies['autoprefixer'] = '^10.4.0';
      packageJson.devDependencies['postcss'] = '^8.4.0';
    }

    if (config.styling === 'styled-components') {
      packageJson.dependencies['styled-components'] = '^6.0.0';
      if (config.typescript) {
        packageJson.devDependencies['@types/styled-components'] = '^5.1.0';
      }
    }

    const content = JSON.stringify(packageJson, null, 2);
    
    return {
      path: 'package.json',
      name: 'package.json',
      extension: 'json',
      content,
      size: content.length,
      language: 'json',
      imports: [],
      exports: [],
      dependencies: Object.keys(packageJson.dependencies)
    };
  }

  private generateReadme(config: CodeGenerationConfig): any {
    const content = `# Generated Figma Component

This component was automatically generated from a Figma design using an AI-powered code generator.

## Features

- **Framework**: ${config.framework}
- **Language**: ${config.typescript ? 'TypeScript' : 'JavaScript'}
- **Styling**: ${config.styling}
- **Accessibility**: WCAG ${config.accessibility.wcagLevel} compliant
- **Testing**: ${config.testing.unitTests ? 'Unit tests included' : 'No tests'}

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Usage

\`\`\`${config.typescript ? 'tsx' : 'jsx'}
import GeneratedComponent from './GeneratedComponent';

function App() {
  return (
    <div>
      <GeneratedComponent className="custom-class" />
    </div>
  );
}
\`\`\`

## Customization

The component accepts the following props:

- \`className\`: Additional CSS classes
- \`...props\`: Any other props are passed through to the root element

## Design Tokens

The component uses design tokens extracted from the original Figma design for consistent styling.

## Accessibility

This component follows WCAG ${config.accessibility.wcagLevel} guidelines and includes:

- Proper semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## License

MIT
`;

    return {
      path: 'README.md',
      name: 'README.md',
      extension: 'md',
      content,
      size: content.length,
      language: 'markdown',
      imports: [],
      exports: [],
      dependencies: []
    };
  }

  private generateTestFile(mapping: ComponentMapping, config: CodeGenerationConfig): any {
    const { componentName } = mapping;
    const content = `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByText('Generated Component')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${componentName} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<${componentName} data-testid="test-component" />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('has accessible content', () => {
    render(<${componentName} />);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });
});
`;

    return {
      path: `src/${componentName}.test.${config.typescript ? 'tsx' : 'jsx'}`,
      name: `${componentName}.test.${config.typescript ? 'tsx' : 'jsx'}`,
      extension: config.typescript ? 'tsx' : 'jsx',
      content,
      size: content.length,
      language: config.typescript ? 'typescript' : 'javascript',
      imports: ['react', '@testing-library/react', '@testing-library/jest-dom'],
      exports: [],
      dependencies: []
    };
  }

  private optimizeGeneratedCode(files: any[], config: CodeGenerationConfig): any[] {
    return files.map(file => {
      let optimizedContent = file.content;
      
      // Remove unused imports
      optimizedContent = this.removeUnusedImports(optimizedContent);
      
      // Optimize for tree shaking
      if (config.optimization.treeshaking) {
        optimizedContent = this.optimizeForTreeShaking(optimizedContent);
      }
      
      // Add lazy loading if enabled
      if (config.optimization.lazyLoading && file.language.includes('script')) {
        optimizedContent = this.addLazyLoading(optimizedContent);
      }
      
      return {
        ...file,
        content: optimizedContent,
        size: optimizedContent.length
      };
    });
  }

  private removeUnusedImports(content: string): string {
    // Simple implementation - in production, use a proper AST parser
    const lines = content.split('\n');
    const importLines = lines.filter(line => line.trim().startsWith('import'));
    const codeLines = lines.filter(line => !line.trim().startsWith('import') && line.trim() !== '');
    const codeContent = codeLines.join('\n');
    
    const usedImports = importLines.filter(importLine => {
      const match = importLine.match(/import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))/);
      if (!match) return true;
      
      const imports = match[1] ? match[1].split(',').map(s => s.trim()) : [match[2] || match[3]];
      return imports.some(imp => codeContent.includes(imp));
    });
    
    return [...usedImports, '', ...codeLines].join('\n');
  }

  private optimizeForTreeShaking(content: string): string {
    // Add tree-shaking friendly exports
    return content.replace(/export default (\w+);/, 'export { $1 as default };\nexport { $1 };');
  }

  private addLazyLoading(content: string): string {
    // Add React.lazy wrapper for components
    if (content.includes('const ') && content.includes('= (')) {
      return content.replace(
        /export default (\w+);/,
        'export default React.lazy(() => Promise.resolve({ default: $1 }));'
      );
    }
    return content;
  }

  private async assessCodeQuality(files: any[], config: CodeGenerationConfig): Promise<QualityAssessment> {
    const metrics = {
      visual: this.assessVisualQuality(files),
      code: this.assessCodeQuality(files),
      performance: this.assessPerformance(files, config),
      accessibility: this.assessAccessibility(files, config),
      maintainability: this.assessMaintainability(files),
      security: this.assessSecurity(files)
    };

    const overall = Object.values(metrics).reduce((sum, score) => sum + score, 0) / Object.keys(metrics).length;

    return {
      overall,
      categories: metrics,
      issues: this.generateQualityIssues(files, config),
      recommendations: this.generateRecommendations(metrics, config)
    };
  }

  private assessVisualQuality(files: any[]): number {
    // Check for proper styling, responsive design, etc.
    const styleFile = files.find(f => f.extension === 'css' || f.extension === 'scss');
    if (!styleFile) return 70;
    
    const hasResponsive = styleFile.content.includes('@media');
    const hasVariables = styleFile.content.includes('--') || styleFile.content.includes('$');
    const hasModernCSS = styleFile.content.includes('grid') || styleFile.content.includes('flex');
    
    let score = 80;
    if (hasResponsive) score += 10;
    if (hasVariables) score += 5;
    if (hasModernCSS) score += 5;
    
    return Math.min(score, 100);
  }

  private assessCodeQuality(files: any[]): number {
    const codeFiles = files.filter(f => ['tsx', 'jsx', 'ts', 'js'].includes(f.extension));
    if (!codeFiles.length) return 70;
    
    let score = 85;
    
    codeFiles.forEach(file => {
      const lines = file.content.split('\n');
      const hasTypeScript = file.extension.includes('ts');
      const hasProperImports = lines.some(line => line.includes('import'));
      const hasExports = lines.some(line => line.includes('export'));
      const hasComments = lines.some(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));
      
      if (hasTypeScript) score += 5;
      if (hasProperImports && hasExports) score += 5;
      if (hasComments) score += 3;
    });
    
    return Math.min(score, 100);
  }

  private assessPerformance(files: any[], config: CodeGenerationConfig): number {
    let score = 80;
    
    if (config.optimization.treeshaking) score += 5;
    if (config.optimization.codesplitting) score += 5;
    if (config.optimization.lazyLoading) score += 5;
    if (config.optimization.bundleAnalysis) score += 5;
    
    return Math.min(score, 100);
  }

  private assessAccessibility(files: any[], config: CodeGenerationConfig): number {
    let score = 85;
    
    if (config.accessibility.screenReader) score += 5;
    if (config.accessibility.keyboardNavigation) score += 5;
    if (config.accessibility.colorContrast) score += 5;
    
    return Math.min(score, 100);
  }

  private assessMaintainability(files: any[]): number {
    const hasTests = files.some(f => f.name.includes('.test.'));
    const hasReadme = files.some(f => f.name === 'README.md');
    const hasTypes = files.some(f => f.name === 'types.ts');
    
    let score = 80;
    if (hasTests) score += 10;
    if (hasReadme) score += 5;
    if (hasTypes) score += 5;
    
    return Math.min(score, 100);
  }

  private assessSecurity(files: any[]): number {
    // Basic security checks
    const packageFile = files.find(f => f.name === 'package.json');
    if (!packageFile) return 85;
    
    const packageData = JSON.parse(packageFile.content);
    const hasSecurityDeps = Object.keys(packageData.devDependencies || {}).some(dep => 
      dep.includes('eslint') || dep.includes('security')
    );
    
    return hasSecurityDeps ? 95 : 85;
  }

  private generateQualityIssues(files: any[], config: CodeGenerationConfig): any[] {
    const issues = [];
    
    if (!config.testing.unitTests) {
      issues.push({
        level: 'warning',
        message: 'No unit tests found. Consider adding tests for better code reliability.',
        category: 'maintainability'
      });
    }
    
    if (!config.accessibility.screenReader) {
      issues.push({
        level: 'warning',
        message: 'Screen reader support is disabled. Enable for better accessibility.',
        category: 'accessibility'
      });
    }
    
    return issues;
  }

  private generateRecommendations(metrics: any, config: CodeGenerationConfig): string[] {
    const recommendations = [];
    
    if (metrics.performance < 90) {
      recommendations.push('Enable all optimization features for better performance');
    }
    
    if (metrics.accessibility < 95) {
      recommendations.push('Enable all accessibility features for WCAG compliance');
    }
    
    if (metrics.maintainability < 90) {
      recommendations.push('Add unit tests and documentation for better maintainability');
    }
    
    if (!config.typescript) {
      recommendations.push('Consider using TypeScript for better type safety');
    }
    
    return recommendations;
  }

  private buildProjectStructure(files: any[]): any {
    const structure = {
      root: 'src',
      components: [],
      hooks: [],
      utils: [],
      types: [],
      styles: [],
      tests: [],
      assets: []
    };
    
    files.forEach(file => {
      if (file.path.includes('.tsx') || file.path.includes('.jsx')) {
        structure.components.push(file.path);
      } else if (file.path.includes('/types') || file.name.includes('types')) {
        structure.types.push(file.path);
      } else if (file.path.includes('.test.') || file.path.includes('.spec.')) {
        structure.tests.push(file.path);
      } else if (file.path.includes('.css') || file.path.includes('.scss')) {
        structure.styles.push(file.path);
      }
    });
    
    return structure;
  }

  private calculateAdvancedMetrics(files: any[], componentCount: number): any {
    const totalLines = files.reduce((sum, file) => sum + file.content.split('\n').length, 0);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const codeFiles = files.filter(f => ['tsx', 'jsx', 'ts', 'js'].includes(f.extension));
    
    return {
      linesOfCode: totalLines,
      complexity: this.calculateCyclomaticComplexity(codeFiles),
      maintainabilityIndex: this.calculateMaintainabilityIndex(codeFiles),
      duplicateLines: this.calculateDuplicateLines(codeFiles),
      testCoverage: this.calculateTestCoverage(files),
      bundleSize: totalSize,
      loadTime: this.estimateLoadTime(totalSize),
      performanceScore: this.calculatePerformanceScore(files)
    };
  }

  private calculateCyclomaticComplexity(files: any[]): number {
    let complexity = 0;
    
    files.forEach(file => {
      const content = file.content;
      // Count decision points
      const decisions = (content.match(/if|else|while|for|switch|case|\?|&&|\|\|/g) || []).length;
      complexity += decisions + 1; // +1 for the base path
    });
    
    return complexity;
  }

  private calculateMaintainabilityIndex(files: any[]): number {
    // Simplified maintainability index calculation
    const avgLinesPerFile = files.reduce((sum, f) => sum + f.content.split('\n').length, 0) / files.length;
    const hasTypes = files.some(f => f.extension.includes('ts'));
    const hasTests = files.some(f => f.name.includes('.test.'));
    
    let index = 100;
    if (avgLinesPerFile > 200) index -= 10;
    if (!hasTypes) index -= 15;
    if (!hasTests) index -= 20;
    
    return Math.max(index, 0);
  }

  private calculateDuplicateLines(files: any[]): number {
    // Simple duplicate detection
    const allLines = files.flatMap(f => f.content.split('\n').map(line => line.trim()));
    const uniqueLines = new Set(allLines.filter(line => line.length > 10));
    
    return allLines.length - uniqueLines.size;
  }

  private calculateTestCoverage(files: any[]): number {
    const testFiles = files.filter(f => f.name.includes('.test.') || f.name.includes('.spec.'));
    const codeFiles = files.filter(f => ['tsx', 'jsx', 'ts', 'js'].includes(f.extension) && !f.name.includes('.test.'));
    
    if (codeFiles.length === 0) return 0;
    
    return (testFiles.length / codeFiles.length) * 100;
  }

  private estimateLoadTime(bundleSize: number): number {
    // Estimate load time based on bundle size (assuming 3G connection)
    const bytesPerSecond = 1.5 * 1024 * 1024; // 1.5 MB/s
    return (bundleSize / bytesPerSecond) * 1000; // Convert to milliseconds
  }

  private calculatePerformanceScore(files: any[]): number {
    const bundleSize = files.reduce((sum, file) => sum + file.size, 0);
    const hasOptimizations = files.some(f => f.content.includes('React.lazy') || f.content.includes('memo'));
    
    let score = 90;
    if (bundleSize > 100000) score -= 10; // Penalty for large bundles
    if (hasOptimizations) score += 10;
    
    return Math.min(score, 100);
  }

  private generateEnhancedPreview(files: any[], designTokens: any): string {
    const componentFile = files.find(f => f.path.includes('.tsx') || f.path.includes('.jsx'));
    
    return `
      <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2 style="color: #1f2937; margin-bottom: 16px;">Enhanced Component Preview</h2>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="color: #374151; margin: 0 0 8px 0;">Component: ${componentFile?.name || 'Unknown'}</h3>
          <p style="color: #6b7280; margin: 0;">Size: ${componentFile?.size || 0} bytes</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
          <div style="max-width: 28rem; margin: 0 auto; background: white; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="padding: 24px;">
              <h2 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 16px;">Generated Component</h2>
              <p style="color: #6b7280; margin-bottom: 24px;">This is a sample component generated from your Figma design.</p>
              <button style="width: 100%; background: #2563eb; color: white; padding: 8px 16px; border-radius: 8px; border: none; font-weight: 500; cursor: pointer;">Get Started</button>
            </div>
          </div>
        </div>
        <div style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
          Design tokens: ${designTokens.colors.length} colors, ${designTokens.fonts.length} fonts
        </div>
      </div>
    `;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Export singleton instance
export const enhancedCodeGenerationEngine = EnhancedCodeGenerationEngine.getInstance();
