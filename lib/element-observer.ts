/**
 * Element Observer Utility
 * Watches for elements to appear in the DOM and executes callbacks
 * Solves the race condition problem with fixed timeouts
 */

import { logger } from './logger'

interface ObserverOptions {
  timeout?: number // Max time to wait (ms)
  parent?: HTMLElement // Parent element to observe (default: document.body)
  debug?: boolean // Enable debug logging
}

interface PendingObservation {
  elementId: string
  callback: (element: HTMLElement) => void
  options: ObserverOptions
  startTime: number
  timeoutId?: NodeJS.Timeout
}

class ElementObserver {
  private observer: MutationObserver | null = null
  private pendingObservations: Map<string, PendingObservation> = new Map()
  private isObserving = false

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
      this.initializeObserver()
    }
  }

  /**
   * Initialize the MutationObserver
   */
  private initializeObserver() {
    if (typeof MutationObserver === 'undefined') {
      logger.warn('OBSERVER', 'MutationObserver not available')
      return
    }
    
    this.observer = new MutationObserver((mutations) => {
      // Check all pending observations
      this.pendingObservations.forEach((observation, key) => {
        const element = typeof document !== 'undefined' ? document.getElementById(observation.elementId) : null
        
        if (element) {
          // Element found!
          if (observation.options.debug) {
            logger.success('OBSERVER', `Element "${observation.elementId}" found after ${Date.now() - observation.startTime}ms`)
          }
          
          // Clear timeout if exists
          if (observation.timeoutId) {
            clearTimeout(observation.timeoutId)
          }
          
          // Execute callback
          observation.callback(element as HTMLElement)
          
          // Remove from pending
          this.pendingObservations.delete(key)
          
          // Stop observing if no more pending
          if (this.pendingObservations.size === 0) {
            this.stopObserving()
          }
        }
      })
    })
  }

  /**
   * Start observing DOM mutations
   */
  private startObserving(parent: HTMLElement | undefined = undefined) {
    if (this.isObserving || !this.observer) return
    if (typeof document === 'undefined') return
    
    const targetParent = parent || document.body
    
    this.observer.observe(targetParent, {
      childList: true,
      subtree: true,
      attributes: false, // We only care about elements being added
      characterData: false
    })
    
    this.isObserving = true
    logger.debug('OBSERVER', 'Started observing DOM mutations')
  }

  /**
   * Stop observing DOM mutations
   */
  private stopObserving() {
    if (!this.isObserving || !this.observer) return
    
    this.observer.disconnect()
    this.isObserving = false
    logger.debug('OBSERVER', 'Stopped observing DOM mutations')
  }

  /**
   * Wait for an element to appear in the DOM
   * @param elementId - The ID of the element to wait for
   * @param callback - Function to execute when element is found
   * @param options - Observer options
   * @returns Promise that resolves when element is found or timeout
   */
  waitForElement(
    elementId: string,
    callback: (element: HTMLElement) => void,
    options: ObserverOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if we're on the client side
      if (typeof document === 'undefined') {
        logger.warn('OBSERVER', 'Cannot wait for element - not in browser environment')
        reject(new Error('Not in browser environment'))
        return
      }
      
      const finalOptions: ObserverOptions = {
        timeout: 5000, // Default 5 seconds
        parent: document.body,
        debug: false,
        ...options
      }

      // Check if element already exists
      const existingElement = typeof document !== 'undefined' ? document.getElementById(elementId) : null
      if (existingElement) {
        if (finalOptions.debug) {
          logger.success('OBSERVER', `Element "${elementId}" already exists`)
        }
        callback(existingElement as HTMLElement)
        resolve()
        return
      }

      // Create observation entry
      const observation: PendingObservation = {
        elementId,
        callback: (element) => {
          callback(element)
          resolve()
        },
        options: finalOptions,
        startTime: Date.now()
      }

      // Set timeout if specified
      if (finalOptions.timeout) {
        observation.timeoutId = setTimeout(() => {
          logger.warn('OBSERVER', `Timeout waiting for element "${elementId}" after ${finalOptions.timeout}ms`)
          this.pendingObservations.delete(elementId)
          
          if (this.pendingObservations.size === 0) {
            this.stopObserving()
          }
          
          reject(new Error(`Element "${elementId}" not found within ${finalOptions.timeout}ms`))
        }, finalOptions.timeout)
      }

      // Add to pending observations
      this.pendingObservations.set(elementId, observation)

      // Start observing (will check for browser environment internally)
      this.startObserving(finalOptions.parent)

      if (finalOptions.debug) {
        logger.debug('OBSERVER', `Waiting for element "${elementId}"...`)
      }
    })
  }

  /**
   * Wait for multiple elements to appear
   * @param elementIds - Array of element IDs to wait for
   * @param callback - Function to execute when ALL elements are found
   * @param options - Observer options
   */
  async waitForElements(
    elementIds: string[],
    callback: (elements: HTMLElement[]) => void,
    options: ObserverOptions = {}
  ): Promise<void> {
    const foundElements: HTMLElement[] = []
    const promises = elementIds.map(id => 
      this.waitForElement(
        id,
        (element) => {
          foundElements.push(element)
        },
        options
      ).catch(() => {
        logger.warn('OBSERVER', `Failed to find element "${id}"`)
        return null
      })
    )

    await Promise.all(promises)
    
    if (foundElements.length === elementIds.length) {
      callback(foundElements)
    } else {
      logger.warn('OBSERVER', `Only found ${foundElements.length} of ${elementIds.length} elements`)
    }
  }

  /**
   * Try to find an element with fallback options
   * @param primaryId - Primary element ID to look for
   * @param fallbackIds - Fallback IDs to try if primary not found
   * @param callback - Function to execute when any element is found
   * @param options - Observer options
   */
  async findElementWithFallback(
    primaryId: string,
    fallbackIds: string[],
    callback: (element: HTMLElement, foundId: string) => void,
    options: ObserverOptions = {}
  ): Promise<void> {
    try {
      // Try primary ID first
      await this.waitForElement(primaryId, (element) => {
        callback(element, primaryId)
      }, { ...options, timeout: options.timeout || 2000 })
    } catch (error) {
      // Try fallbacks
      for (const fallbackId of fallbackIds) {
        try {
          await this.waitForElement(fallbackId, (element) => {
            logger.debug('OBSERVER', `Using fallback element "${fallbackId}" instead of "${primaryId}"`)
            callback(element, fallbackId)
          }, { ...options, timeout: 1000 })
          return // Success with fallback
        } catch {
          continue // Try next fallback
        }
      }
      
      logger.error('OBSERVER', `Could not find element "${primaryId}" or any fallbacks`)
      throw new Error(`Element not found: ${primaryId}`)
    }
  }

  /**
   * Clean up observer
   */
  cleanup() {
    // Clear all timeouts
    this.pendingObservations.forEach(observation => {
      if (observation.timeoutId) {
        clearTimeout(observation.timeoutId)
      }
    })
    
    // Clear pending observations
    this.pendingObservations.clear()
    
    // Stop observing
    this.stopObserving()
    
    // Destroy observer
    this.observer = null
    
    logger.debug('OBSERVER', 'Cleaned up element observer')
  }
}

// Export singleton instance
export const elementObserver = new ElementObserver()

// Export for testing
export { ElementObserver }