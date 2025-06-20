import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Something went wrong.</h1>
          <p>We're working to fix the issue. Please try again later.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
