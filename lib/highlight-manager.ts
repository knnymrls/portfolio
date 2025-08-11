export interface HighlightOptions {
  duration?: number
  style?: 'spotlight' | 'glow' | 'pulse' | 'border' | 'simple'
  scrollBehavior?: 'smooth' | 'instant' | 'none'
  dimOthers?: boolean
  intensity?: 'low' | 'medium' | 'high'
}

export interface HighlightSequence {
  elementId: string
  options?: HighlightOptions
  description?: string
}

export class HighlightManager {
  private activeHighlights = new Set<string>()
  private sequenceInProgress = false
  private abortController: AbortController | null = null
  
  // Default timing based on content length
  calculateDuration(element: HTMLElement): number {
    const text = element.textContent || ''
    const wordCount = text.split(/\s+/).length
    const imageCount = element.querySelectorAll('img').length
    
    // Base time + time per word + time per image
    const baseTime = 2000 // 2 seconds minimum
    const timePerWord = 50 // 50ms per word
    const timePerImage = 1000 // 1 second per image
    
    const calculatedTime = baseTime + (wordCount * timePerWord) + (imageCount * timePerImage)
    
    // Cap at 10 seconds
    return Math.min(calculatedTime, 10000)
  }
  
  // Highlight a single element
  async highlight(elementId: string, options: HighlightOptions = {}): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`)
      return
    }
    
    const {
      duration = this.calculateDuration(element),
      style = 'simple',
      scrollBehavior = 'smooth',
      dimOthers = true,
      intensity = 'medium'
    } = options
    
    // Scroll to element if needed
    if (scrollBehavior !== 'none') {
      await this.scrollToElement(element, scrollBehavior)
    }
    
    // Simple opacity-based highlighting
    this.applySimpleHighlight(elementId)
    
    // Track active highlight
    this.activeHighlights.add(elementId)
    
    // Emit highlight event for suggestion context
    window.dispatchEvent(new CustomEvent('contentHighlighted', {
      detail: { elementId }
    }))
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeHighlight(elementId)
      }, duration)
    }
  }
  
  // Highlight multiple elements in sequence
  async highlightSequence(sequence: HighlightSequence[]): Promise<void> {
    if (this.sequenceInProgress) {
      await this.stopSequence()
    }
    
    this.sequenceInProgress = true
    this.abortController = new AbortController()
    
    for (const item of sequence) {
      if (this.abortController.signal.aborted) break
      
      // Clear previous highlights
      this.clearAllHighlights()
      
      // Apply highlight
      await this.highlight(item.elementId, item.options)
      
      // If description provided, could trigger AI narration
      if (item.description) {
        this.announceHighlight(item.elementId, item.description)
      }
      
      // Wait for duration
      const element = document.getElementById(item.elementId)
      const duration = item.options?.duration || (element ? this.calculateDuration(element) : 3000)
      
      await this.delay(duration, this.abortController.signal)
    }
    
    this.sequenceInProgress = false
    this.clearAllHighlights()
  }
  
  // Highlight multiple elements simultaneously
  async highlightParallel(elementIds: string[], options: HighlightOptions = {}): Promise<void> {
    const promises = elementIds.map(id => this.highlight(id, options))
    await Promise.all(promises)
  }
  
  // Remove specific highlight
  removeHighlight(elementId: string): void {
    this.activeHighlights.delete(elementId)
    
    // Remove opacity styling if no more highlights
    if (this.activeHighlights.size === 0) {
      this.removeOpacityDimming()
    }
  }
  
  // Clear all highlights
  clearAllHighlights(): void {
    this.activeHighlights.clear()
    this.removeOpacityDimming()
  }
  
  // Stop ongoing sequence
  async stopSequence(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort()
    }
    this.sequenceInProgress = false
    this.clearAllHighlights()
  }
  
  // Private methods
  private applySimpleHighlight(elementId: string): void {
    // Get all major content sections
    const sections = document.querySelectorAll('section, article, .case-study-card, [data-highlight-id]')
    
    sections.forEach((section) => {
      const sectionElement = section as HTMLElement
      
      // Check if this element or its children contain the highlighted element
      const highlightedElement = document.getElementById(elementId)
      const isHighlighted = sectionElement.id === elementId || 
                           sectionElement.contains(highlightedElement) ||
                           sectionElement === highlightedElement
      
      if (!isHighlighted) {
        // Dim non-highlighted elements
        sectionElement.style.opacity = '0.3'
        sectionElement.style.transition = 'opacity 0.3s ease-in-out'
      } else {
        // Keep highlighted element at full opacity
        sectionElement.style.opacity = '1'
        sectionElement.style.transition = 'opacity 0.3s ease-in-out'
      }
    })
  }
  
  private dimOtherElements(highlightedId: string): void {
    // Add dimming overlay
    if (!document.querySelector('.highlight-overlay')) {
      const overlay = document.createElement('div')
      overlay.className = 'highlight-overlay'
      document.body.appendChild(overlay)
    }
    
    // Mark highlighted element
    const highlighted = document.getElementById(highlightedId)
    if (highlighted) {
      highlighted.classList.add('highlighted-element')
    }
    
    // Add dimming class to body
    document.body.classList.add('highlighting-active')
  }
  
  private removeOpacityDimming(): void {
    // Restore opacity for all elements
    const sections = document.querySelectorAll('section, article, .case-study-card, [data-highlight-id]')
    sections.forEach((section) => {
      const sectionElement = section as HTMLElement
      sectionElement.style.opacity = '1'
      sectionElement.style.transition = 'opacity 0.3s ease-in-out'
    })
  }
  
  private removeDimming(): void {
    const overlay = document.querySelector('.highlight-overlay')
    if (overlay) {
      overlay.remove()
    }
    
    document.querySelectorAll('.highlighted-element').forEach(el => {
      el.classList.remove('highlighted-element')
    })
    
    document.body.classList.remove('highlighting-active')
  }
  
  private async scrollToElement(element: HTMLElement, behavior: 'smooth' | 'instant'): Promise<void> {
    const rect = element.getBoundingClientRect()
    const absoluteTop = rect.top + window.pageYOffset
    const offset = 100 // Leave some space at the top
    
    return new Promise(resolve => {
      const scrollOptions: ScrollToOptions = {
        top: absoluteTop - offset,
        behavior
      }
      
      window.scrollTo(scrollOptions)
      
      // Wait for scroll to complete (approximate)
      const duration = behavior === 'smooth' ? 800 : 0
      setTimeout(resolve, duration)
    })
  }
  
  private announceHighlight(elementId: string, description: string): void {
    // Dispatch custom event that ChatProvider can listen to
    window.dispatchEvent(new CustomEvent('highlightAnnouncement', {
      detail: { elementId, description }
    }))
  }
  
  private delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms)
      
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout)
          reject(new Error('Sequence aborted'))
        })
      }
    })
  }
  
  // Get highlight status
  getStatus(): {
    activeHighlights: string[]
    sequenceInProgress: boolean
  } {
    return {
      activeHighlights: Array.from(this.activeHighlights),
      sequenceInProgress: this.sequenceInProgress
    }
  }
}

// Export singleton instance
export const highlightManager = new HighlightManager()

// Convenience functions
export async function highlightElement(elementId: string, options?: HighlightOptions): Promise<void> {
  return highlightManager.highlight(elementId, options)
}

export async function highlightSequence(sequence: HighlightSequence[]): Promise<void> {
  return highlightManager.highlightSequence(sequence)
}

export async function highlightParallel(elementIds: string[], options?: HighlightOptions): Promise<void> {
  return highlightManager.highlightParallel(elementIds, options)
}

export function clearHighlights(): void {
  highlightManager.clearAllHighlights()
}