// Web Worker for handling CPU-intensive code processing
self.addEventListener('message', async (event) => {
  const { type, payload, id } = event.data;

  try {
    let result;

    switch (type) {
      case 'PARSE_SVG':
        result = await parseSvgInWorker(payload.svg);
        break;
      case 'TRANSFORM_CODE':
        result = await transformCodeInWorker(payload.code, payload.config);
        break;
      case 'OPTIMIZE_CODE':
        result = await optimizeCodeInWorker(payload.code);
        break;
      case 'VALIDATE_CODE':
        result = await validateCodeInWorker(payload.code, payload.framework);
        break;
      default:
        throw new Error(`Unknown worker task: ${type}`);
    }

    self.postMessage({
      id,
      type: 'SUCCESS',
      result
    });
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    });
  }
});

async function parseSvgInWorker(svg: string) {
  // SVG parsing logic that can be CPU intensive
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  
  // Extract all elements and their properties
  const elements = [];
  const walker = document.createTreeWalker(
    doc,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    const element = node as Element;
    elements.push({
      tagName: element.tagName,
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>),
      textContent: element.textContent?.trim() || ''
    });
  }

  return { elements, nodeCount: elements.length };
}

async function transformCodeInWorker(code: string, config: any) {
  // Code transformation logic
  let transformed = code;

  // Apply framework-specific transformations
  switch (config.framework) {
    case 'vue':
      transformed = transformToVue(code);
      break;
    case 'angular':
      transformed = transformToAngular(code);
      break;
    case 'svelte':
      transformed = transformToSvelte(code);
      break;
    default:
      // Keep as React
      break;
  }

  return { transformedCode: transformed };
}

async function optimizeCodeInWorker(code: string) {
  // Code optimization logic
  let optimized = code;

  // Remove unnecessary whitespace
  optimized = optimized.replace(/\s+/g, ' ').trim();
  
  // Remove empty lines
  optimized = optimized.replace(/^\s*[\r\n]/gm, '');
  
  // Optimize imports (basic implementation)
  const imports = [];
  const importRegex = /import\s+.*?from\s+['"].*?['"];?\s*/g;
  let match;
  
  while ((match = importRegex.exec(optimized)) !== null) {
    imports.push(match[0]);
  }
  
  // Remove duplicate imports
  const uniqueImports = [...new Set(imports)];
  
  return { optimizedCode: optimized, savings: code.length - optimized.length };
}

async function validateCodeInWorker(code: string, framework: string) {
  const issues = [];
  
  // Basic validation rules
  if (!code.includes('export')) {
    issues.push({ type: 'warning', message: 'No exports found' });
  }
  
  if (framework === 'react' && !code.includes('React')) {
    issues.push({ type: 'error', message: 'React import missing' });
  }
  
  return { valid: issues.filter(i => i.type === 'error').length === 0, issues };
}

function transformToVue(code: string): string {
  // Basic React to Vue transformation
  return code
    .replace(/import React/g, 'import { defineComponent }')
    .replace(/export default function/g, 'export default defineComponent({\n  setup() {\n    return ')
    .replace(/className=/g, 'class=')
    .replace(/\{([^}]+)\}/g, '{{ $1 }}');
}

function transformToAngular(code: string): string {
  // Basic React to Angular transformation
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-generated',
  template: \`${code.replace(/className=/g, 'class=').replace(/\{([^}]+)\}/g, '{{ $1 }}')}\`
})
export class GeneratedComponent {}`;
}

function transformToSvelte(code: string): string {
  // Basic React to Svelte transformation
  return code
    .replace(/import React.*\n/, '')
    .replace(/export default function.*\{/, '<script>\n</script>\n\n')
    .replace(/className=/g, 'class=')
    .replace(/\{([^}]+)\}/g, '{$1}');
}
