import { Component } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

/**
 * Catches render-time exceptions in its subtree. Without this, React
 * unmounts the ENTIRE app on any uncaught render error — which is the
 * exact shape of a "page works, then goes blank a moment later" bug,
 * since it happens the instant real data (not loading skeletons) hits a
 * component that doesn't handle it defensively.
 *
 * Usage: wrap the whole app once (last-resort net), AND wrap individual
 * dashboard sections so one broken chart doesn't take down the rest.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface it in the console so it's actually debuggable, never silent.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { compact, label = "this section" } = this.props;

      return (
        <div
          className={`flex flex-col items-center justify-center text-center gap-2 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 ${
            compact ? "p-6" : "p-12 min-h-[240px]"
          }`}
        >
          <FaExclamationTriangle className="text-red-500" size={compact ? 18 : 26} />
          <p className="font-medium text-red-700 dark:text-red-300">
            Unable to load {label}.
          </p>
          <p className="text-xs text-red-500/80 dark:text-red-400/70 max-w-sm">
            Something went wrong rendering this part of the page. The rest of the app is unaffected.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            <FaRedo size={11} /> Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
