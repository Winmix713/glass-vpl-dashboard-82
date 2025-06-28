
import { FigmaNode } from '@/types/figma-api';

export interface DesignPattern {
  type: 'card' | 'button' | 'form' | 'navigation' | 'header' | 'footer' | 'sidebar' | 'modal';
  confidence: number;
  suggestions: string[];
  accessibility: AccessibilityInsight[];
}

export interface AccessibilityInsight {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  fix: string;
}

export class AIDesignAnalyzer {
  private static instance: AIDesignAnalyzer;

  static getInstance(): AIDesignAnalyzer {
    if (!AIDesignAnalyzer.instance) {
      AIDesignAnalyzer.instance = new AIDesignAnalyzer();
    }
    return AIDesignAnalyzer.instance;
  }

  private constructor() {}

  async analyzeDesignPatterns(nodes: FigmaNode[]): Promise<DesignPattern[]> {
    const patterns: DesignPattern[] = [];

    for (const node of nodes) {
      const pattern = await this.identifyPattern(node);
      if (pattern) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private async identifyPattern(node: FigmaNode): Promise<DesignPattern | null> {
    const { type, name, children, absoluteBoundingBox } = node;

    // Card pattern detection
    if (this.isCardPattern(node)) {
      return {
        type: 'card',
        confidence: 0.85,
        suggestions: [
          'Consider adding subtle shadow for depth',
          'Ensure proper spacing between elements',
          'Add hover states for interactivity'
        ],
        accessibility: this.analyzeCardAccessibility(node)
      };
    }

    // Button pattern detection
    if (this.isButtonPattern(node)) {
      return {
        type: 'button',
        confidence: 0.9,
        suggestions: [
          'Add focus states for keyboard navigation',
          'Ensure minimum 44px touch target',
          'Consider loading states'
        ],
        accessibility: this.analyzeButtonAccessibility(node)
      };
    }

    // Form pattern detection
    if (this.isFormPattern(node)) {
      return {
        type: 'form',
        confidence: 0.8,
        suggestions: [
          'Add proper form validation',
          'Include error states',
          'Group related fields with fieldsets'
        ],
        accessibility: this.analyzeFormAccessibility(node)
      };
    }

    // Navigation pattern detection
    if (this.isNavigationPattern(node)) {
      return {
        type: 'navigation',
        confidence: 0.75,
        suggestions: [
          'Implement keyboard navigation',
          'Add ARIA landmarks',
          'Consider mobile hamburger menu'
        ],
        accessibility: this.analyzeNavigationAccessibility(node)
      };
    }

    return null;
  }

  private isCardPattern(node: FigmaNode): boolean {
    const hasBackground = node.fills && node.fills.length > 0;
    const hasChildren = node.children && node.children.length > 0;
    const hasRectangularShape = node.type === 'FRAME' || node.type === 'RECTANGLE';
    
    return hasBackground && hasChildren && hasRectangularShape;
  }

  private isButtonPattern(node: FigmaNode): boolean {
    const hasText = node.children?.some(child => child.type === 'TEXT');
    const hasBackground = node.fills && node.fills.length > 0;
    const isClickable = node.name?.toLowerCase().includes('button') || 
                       node.name?.toLowerCase().includes('btn');
    
    return hasText && hasBackground && (isClickable || this.hasButtonDimensions(node));
  }

  private hasButtonDimensions(node: FigmaNode): boolean {
    if (!node.absoluteBoundingBox) return false;
    const { width, height } = node.absoluteBoundingBox;
    return width > 60 && width < 300 && height > 30 && height < 80;
  }

  private isFormPattern(node: FigmaNode): boolean {
    if (!node.children) return false;
    
    const hasInputs = node.children.some(child => 
      child.name?.toLowerCase().includes('input') ||
      child.name?.toLowerCase().includes('field') ||
      child.type === 'TEXT' && child.name?.toLowerCase().includes('label')
    );
    
    return hasInputs;
  }

  private isNavigationPattern(node: FigmaNode): boolean {
    if (!node.children) return false;
    
    const hasMultipleItems = node.children.length >= 3;
    const hasLinearLayout = this.isLinearLayout(node);
    const hasNavKeywords = node.name?.toLowerCase().includes('nav') ||
                          node.name?.toLowerCase().includes('menu');
    
    return hasMultipleItems && (hasLinearLayout || hasNavKeywords);
  }

  private isLinearLayout(node: FigmaNode): boolean {
    // Simple heuristic for linear layout detection
    if (!node.children || node.children.length < 2) return false;
    
    const firstChild = node.children[0];
    const secondChild = node.children[1];
    
    if (!firstChild.absoluteBoundingBox || !secondChild.absoluteBoundingBox) {
      return false;
    }
    
    const isHorizontal = Math.abs(
      firstChild.absoluteBoundingBox.y - secondChild.absoluteBoundingBox.y
    ) < 10;
    
    const isVertical = Math.abs(
      firstChild.absoluteBoundingBox.x - secondChild.absoluteBoundingBox.x
    ) < 10;
    
    return isHorizontal || isVertical;
  }

  private analyzeCardAccessibility(node: FigmaNode): AccessibilityInsight[] {
    const insights: AccessibilityInsight[] = [];
    
    insights.push({
      type: 'suggestion',
      message: 'Add semantic HTML structure',
      fix: 'Use <article> or <section> elements for card containers'
    });
    
    if (!this.hasProperContrast(node)) {
      insights.push({
        type: 'warning',
        message: 'Text contrast may be insufficient',
        fix: 'Ensure at least 4.5:1 contrast ratio for normal text'
      });
    }
    
    return insights;
  }

  private analyzeButtonAccessibility(node: FigmaNode): AccessibilityInsight[] {
    const insights: AccessibilityInsight[] = [];
    
    insights.push({
      type: 'suggestion',
      message: 'Add proper ARIA labels',
      fix: 'Include aria-label or aria-describedby attributes'
    });
    
    if (!this.hasMinimumTouchTarget(node)) {
      insights.push({
        type: 'error',
        message: 'Touch target too small',
        fix: 'Ensure buttons are at least 44px × 44px'
      });
    }
    
    return insights;
  }

  private analyzeFormAccessibility(node: FigmaNode): AccessibilityInsight[] {
    const insights: AccessibilityInsight[] = [];
    
    insights.push({
      type: 'error',
      message: 'Associate labels with form controls',
      fix: 'Use proper <label> elements or aria-labelledby'
    });
    
    insights.push({
      type: 'suggestion',
      message: 'Add form validation feedback',
      fix: 'Implement aria-invalid and aria-describedby for errors'
    });
    
    return insights;
  }

  private analyzeNavigationAccessibility(node: FigmaNode): AccessibilityInsight[] {
    const insights: AccessibilityInsight[] = [];
    
    insights.push({
      type: 'error',
      message: 'Add navigation landmarks',
      fix: 'Use <nav> element with proper aria-label'
    });
    
    insights.push({
      type: 'suggestion',
      message: 'Implement keyboard navigation',
      fix: 'Ensure all items are focusable and support arrow key navigation'
    });
    
    return insights;
  }

  private hasProperContrast(node: FigmaNode): boolean {
    // Simplified contrast check - in real implementation, 
    // this would analyze actual colors
    return true;
  }

  private hasMinimumTouchTarget(node: FigmaNode): boolean {
    if (!node.absoluteBoundingBox) return false;
    const { width, height } = node.absoluteBoundingBox;
    return width >= 44 && height >= 44;
  }

  async generateCodeSuggestions(patterns: DesignPattern[]): Promise<string[]> {
    const suggestions: string[] = [];
    
    for (const pattern of patterns) {
      switch (pattern.type) {
        case 'card':
          suggestions.push('Consider using a Card component with proper semantic HTML');
          suggestions.push('Add transition effects for hover states');
          break;
        case 'button':
          suggestions.push('Implement button variants (primary, secondary, outline)');
          suggestions.push('Add loading and disabled states');
          break;
        case 'form':
          suggestions.push('Use form validation library like react-hook-form');
          suggestions.push('Implement proper error handling and display');
          break;
        case 'navigation':
          suggestions.push('Consider using React Router for navigation');
          suggestions.push('Implement responsive navigation with mobile menu');
          break;
      }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  }
}

export const aiDesignAnalyzer = AIDesignAnalyzer.getInstance();
