// Centralized logging utility for better debugging
type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'
type LogCategory = 'AI' | 'NAVIGATION' | 'SEARCH' | 'HIGHLIGHT' | 'CHAT' | 'MEMORY' | 'API' | 'REDIS' | 'EMBEDDINGS' | 'OBSERVER'

interface LogColors {
  [key: string]: string
}

const colors: LogColors = {
  AI: '\x1b[35m',        // Magenta
  NAVIGATION: '\x1b[36m', // Cyan
  SEARCH: '\x1b[33m',     // Yellow
  HIGHLIGHT: '\x1b[32m',  // Green
  CHAT: '\x1b[34m',       // Blue
  MEMORY: '\x1b[95m',     // Light Magenta
  API: '\x1b[31m',        // Red
  REDIS: '\x1b[94m',      // Light Blue
  EMBEDDINGS: '\x1b[35m', // Magenta
  OBSERVER: '\x1b[36m',   // Cyan
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  success: '\x1b[92m',    // Bright Green
  error: '\x1b[91m',      // Bright Red
  warn: '\x1b[93m',       // Bright Yellow
  info: '\x1b[96m',       // Bright Cyan
  debug: '\x1b[90m'       // Gray
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  private formatMessage(category: LogCategory, level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
    const categoryColor = colors[category] || colors.reset
    const levelColor = colors[level] || colors.reset
    
    let formattedMessage = `${colors.dim}[${timestamp}]${colors.reset} ${categoryColor}${colors.bold}[${category}]${colors.reset} ${levelColor}${message}${colors.reset}`
    
    if (data) {
      formattedMessage += '\n' + colors.dim + JSON.stringify(data, null, 2) + colors.reset
    }
    
    return formattedMessage
  }
  
  log(category: LogCategory, level: LogLevel, message: string, data?: any) {
    if (!this.isDevelopment && level === 'debug') return
    
    const formattedMessage = this.formatMessage(category, level, message, data)
    
    switch (level) {
      case 'error':
        console.error(formattedMessage)
        break
      case 'warn':
        console.warn(formattedMessage)
        break
      case 'debug':
        console.debug(formattedMessage)
        break
      default:
        console.log(formattedMessage)
    }
  }
  
  // Convenience methods for different categories
  ai(message: string, data?: any) {
    this.log('AI', 'info', message, data)
  }
  
  navigation(message: string, data?: any) {
    this.log('NAVIGATION', 'info', message, data)
  }
  
  search(message: string, data?: any) {
    this.log('SEARCH', 'info', message, data)
  }
  
  highlight(message: string, data?: any) {
    this.log('HIGHLIGHT', 'info', message, data)
  }
  
  chat(message: string, data?: any) {
    this.log('CHAT', 'info', message, data)
  }
  
  memory(message: string, data?: any) {
    this.log('MEMORY', 'info', message, data)
  }
  
  api(message: string, data?: any) {
    this.log('API', 'info', message, data)
  }
  
  // Level-specific methods
  error(category: LogCategory, message: string | Error, data?: any) {
    const errorMessage = message instanceof Error ? message.message : message
    this.log(category, 'error', errorMessage, data)
    if (message instanceof Error && message.stack) {
      console.error(message.stack)
    }
  }
  
  warn(category: LogCategory, message: string, data?: any) {
    this.log(category, 'warn', message, data)
  }
  
  success(category: LogCategory, message: string, data?: any) {
    this.log(category, 'success', message, data)
  }
  
  debug(category: LogCategory, message: string, data?: any) {
    this.log(category, 'debug', message, data)
  }
  
  info(category: LogCategory, message: string, data?: any) {
    this.log(category, 'info', message, data)
  }
  
  // Special formatting for important events
  divider() {
    console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`)
  }
  
  header(title: string) {
    this.divider()
    console.log(`${colors.bold}${colors.info}  ${title.toUpperCase()}  ${colors.reset}`)
    this.divider()
  }
  
  // Group related logs
  group(title: string) {
    console.group(`${colors.bold}${title}${colors.reset}`)
  }
  
  groupEnd() {
    console.groupEnd()
  }
  
  // Table logging for structured data
  table(data: any) {
    console.table(data)
  }
}

export const logger = new Logger()