const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import staticMapping from '../assets/static_media_mapping.json';

/**
 * Standardizes image URLs across the application.
 * Handles absolute URLs, relative paths, static assets (Cloudinary mapping), and fallbacks.
 */
export const getImageUrl = (path) => {
  if (!path) return '/static/assets/main/img/placeholder.webp';
  
  // 1. If it's already an absolute URL (Cloudinary or other), return as is
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // 2. Check if it's a known static asset mapped to Cloudinary
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (staticMapping[cleanPath]) {
    return staticMapping[cleanPath];
  }

  // 3. If it's a static asset but not in mapping (or mapping failed), return local path
  if (cleanPath.startsWith('/static')) {
    return cleanPath;
  }

  // 4. Otherwise, it's an upload from the backend (though DB now stores absolute URLs)
  // This handles any leftover legacy relative paths in DB
  return `${API_URL}${cleanPath}`;
};

/**
 * Handles image loading errors by providing a default placeholder.
 */
export const handleImageError = (e) => {
  e.target.onerror = null; 
  const placeholder = staticMapping['/static/assets/main/img/placeholder.webp'] || '/static/assets/main/img/placeholder.webp';
  e.target.src = placeholder;
};
