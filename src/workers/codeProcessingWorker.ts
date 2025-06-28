/**
 * Code Processing Web Worker
 * Handles CPU-intensive code generation tasks
 */

// Web Worker context
declare const self: DedicatedWorkerGlobalScope;

interface WorkerMessage {
  type: string;
  data: any;
  id?: string;
}

interface WorkerResponse {
  success: boolean;
  data?: any;
  error?: string;
  id?: string;
}

/**
 * Process design analysis to generate components
 */
function generateComponents(data: any): { jsx: string; css: string } {
  const { designAnalysis, structure, config } = data;
  
  // Generate JSX based on design analysis
  const jsx = generateJSXFromDesign(designAnalysis, config);
  
  // Generate CSS based on design tokens
  const css = generateCSSFromDesign(designAnalysis, config);
  
  return { jsx, css };
}

/**
 * Generate JSX code from design analysis
 */
function generateJSXFromDesign(designAnalysis: any, config: any): string {
  const componentName = 'GeneratedComponent';
  const hasInteractivity = designAnalysis.interactions?.length > 0;
  
  let jsx = `import React${hasInteractivity ? ', { useState }' : ''} from 'react';\n`;
  
  if (config.typescript) {
    jsx += `
interface ${componentName}Props {
  className?: string;
  [key: string]: any;
}

const ${componentName}: React.FC<${componentName}Props> = ({ className = '', ...props }) => {\n`;
  } else {
    jsx += `
const ${componentName} = ({ className = '', ...props }) => {\n`;
  }
  
  // Add state if interactive
  if (hasInteractivity) {
    jsx += `  const [isActive, setIsActive] = useState(false);\n\n`;
  }
  
  jsx += `  return (
    <div className={\`generated-component \${className}\`} {...props}>
      <div className="component-content">
        ${generateComponentContent(designAnalysis)}
      </div>
    </div>
  );
};

export default ${componentName};`;
  
  return jsx;
}

/**
 * Generate component content based on design elements
 */
function generateComponentContent(designAnalysis: any): string {
  if (!designAnalysis.components || designAnalysis.components.length === 0) {
    return `
        <h1>Generated Component</h1>
        <p>This component was generated from your Figma design.</p>
        <button className="cta-button">Get Started</button>`;
  }
  
  // Process design components
  let content = '';
  designAnalysis.components.forEach((component: any, index: number) => {
    switch (component.type) {
      case 'TEXT':
        content += `        <${component.tag || 'p'} className="text-element-${index}">${component.content || 'Text Content'}</${component.tag || 'p'}>\n`;
        break;
      case 'BUTTON':
        content += `        <button className="button-element-${index}" onClick={() => console.log('Button clicked')}>${component.content || 'Button'}</button>\n`;
        break;
      case 'IMAGE':
        content += `        <img src="${component.src || '/placeholder.jpg'}" alt="${component.alt || 'Generated image'}" className="image-element-${index}" />\n`;
        break;
      default:
        content += `        <div className="element-${index}">${component.content || 'Content'}</div>\n`;
    }
  });
  
  return content || `
        <h1>Generated Component</h1>
        <p>This component was generated from your Figma design.</p>`;
}

/**
 * Generate CSS from design tokens
 */
function generateCSSFromDesign(designAnalysis: any, config: any): string {
  let css = `.generated-component {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.component-content {
  flex: 1;
}

.generated-component h1 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.generated-component p {
  margin: 0 0 16px 0;
  color: #666666;
  line-height: 1.5;
}

.cta-button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background: #0056b3;
}`;

  // Add component-specific styles
  if (designAnalysis.components) {
    designAnalysis.components.forEach((component: any, index: number) => {
      switch (component.type) {
        case 'TEXT':
          css += `

.text-element-${index} {
  font-size: ${component.fontSize || '16px'};
  color: ${component.color || '#333333'};
  margin-bottom: 8px;
}`;
          break;
        case 'BUTTON':
          css += `

.button-element-${index} {
  padding: 8px 16px;
  background: ${component.backgroundColor || '#007bff'};
  color: ${component.color || '#ffffff'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button-element-${index}:hover {
  opacity: 0.9;
}`;
          break;
        case 'IMAGE':
          css += `

.image-element-${index} {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}`;
          break;
        default:
          css += `

.element-${index} {
  margin-bottom: 12px;
}`;
      }
    });
  }

  // Add responsive styles
  css += `

@media (max-width: 768px) {
  .generated-component {
    padding: 16px;
  }
  
  .generated-component h1 {
    font-size: 20px;
  }
}`;

  return css;
}

/**
 * Optimize generated code
 */
function optimizeCode(data: any): any {
  const { code, config } = data;
  
  let optimizedCode = { ...code };
  
  // Remove unused imports
  if (optimizedCode.jsx) {
    optimizedCode.jsx = removeUnusedImports(optimizedCode.jsx);
  }
  
  // Minify CSS if needed
  if (optimizedCode.css && config.optimization?.minify) {
    optimizedCode.css = minifyCSS(optimizedCode.css);
  }
  
  return optimizedCode;
}

/**
 * Remove unused imports from JSX
 */
function removeUnusedImports(jsx: string): string {
  const lines = jsx.split('\n');
  const filteredLines = lines.filter(line => {
    // Keep import if it's used in the code
    if (line.includes('import')) {
      const importMatch = line.match(/import\s+.*?\s+from/);
      if (importMatch) {
        const importedItems = line.match(/import\s+{([^}]+)}/);
        if (importedItems) {
          const items = importedItems[1].split(',').map(item => item.trim());
          return items.some(item => jsx.includes(item));
        }
      }
      return true; // Keep all other imports for now
    }
    return true;
  });
  
  return filteredLines.join('\n');
}

/**
 * Basic CSS minification
 */
function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
    .replace(/\s*}\s*/g, '}') // Remove spaces around closing brace
    .replace(/\s*,\s*/g, ',') // Remove spaces around commas
    .replace(/\s*:\s*/g, ':') // Remove spaces around colons
    .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
    .trim();
}

/**
 * Analyze code complexity
 */
function analyzeComplexity(data: any): any {
  const { code } = data;
  
  if (typeof code !== 'string') {
    return { complexity: 1, issues: [] };
  }
  
  const issues = [];
  let complexity = 1;
  
  // Count conditional statements
  const conditionals = code.match(/if\s*\(|else|switch|case/g);
  if (conditionals) {
    complexity += conditionals.length;
  }
  
  // Count loops
  const loops = code.match(/for\s*\(|while\s*\(|forEach|map\s*\(/g);
  if (loops) {
    complexity += loops.length;
  }
  
  // Check for deeply nested structures
  const depth = calculateNestingDepth(code);
  if (depth > 4) {
    issues.push(`High nesting depth: ${depth} levels`);
    complexity += depth;
  }
  
  // Check for long functions
  const functionLength = code.split('\n').length;
  if (functionLength > 50) {
    issues.push(`Long function: ${functionLength} lines`);
  }
  
  return { complexity, issues, depth };
}

/**
 * Calculate maximum nesting depth
 */
function calculateNestingDepth(code: string): number {
  let maxDepth = 0;
  let currentDepth = 0;
  
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (code[i] === '}') {
      currentDepth--;
    }
  }
  
  return maxDepth;
}

/**
 * Main message handler
 */
self.onmessage = function(event: MessageEvent<WorkerMessage>) {
  const { type, data, id } = event.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'generateComponents':
        result = generateComponents(data);
        break;
        
      case 'optimizeCode':
        result = optimizeCode(data);
        break;
        
      case 'analyzeComplexity':
        result = analyzeComplexity(data);
        break;
        
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    const response: WorkerResponse = {
      success: true,
      data: result,
      id
    };
    
    self.postMessage(response);
    
  } catch (error) {
    const response: WorkerResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    };
    
    self.postMessage(response);
  }
};

// Handle worker errors
self.onerror = function(error) {
  console.error('Worker error:', error);
};

self.onunhandledrejection = function(event) {
  console.error('Worker unhandled rejection:', event.reason);
};
