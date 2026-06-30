import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error Boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mt-2">Vui lòng tải lại trang hoặc quay lại sau.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;