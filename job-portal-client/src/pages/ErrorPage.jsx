import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let status = 500;
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.statusText || "Request failed";
    message = typeof error.data === "string" ? error.data : message;
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  if (status === 404) {
    title = "Page Not Found";
    message = "The page you are looking for does not exist.";
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center bg-white border rounded-md p-8 shadow-sm">
        <p className="text-sm font-semibold text-red-600 mb-2">Error {status}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="px-4 py-2 bg-blue text-white rounded">
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded text-gray-700"
            type="button"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;