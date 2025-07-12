import { useLocation } from "react-router-dom";

/**
 * Get current query parameters as a string
 */
export const useQueryParams = () => {
  const location = useLocation();

  return location.search;
};

/**
 * Append current query parameters to a path
 */
export const withQueryParams = (path: string, search?: string) => {
  const queryParams = search || window.location.search;

  return queryParams ? `${path}${queryParams}` : path;
};

/**
 * Hook to get a function that creates paths with preserved query parameters
 */
export const useNavigationWithParams = () => {
  const queryParams = useQueryParams();

  return (path: string) => withQueryParams(path, queryParams);
};
