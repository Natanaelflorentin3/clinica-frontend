import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hayError: boolean
}

// Los Error Boundaries solo se pueden escribir como componentes de clase.
// Atrapa errores de render de sus hijos y muestra el fallback en lugar de tumbar toda la app.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hayError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hayError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary atrapó un error:', error, info.componentStack)
  }

  render() {
    if (this.state.hayError) return this.props.fallback
    return this.props.children
  }
}
