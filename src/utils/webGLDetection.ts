
/**
 * Utility functions for WebGL detection and support
 */

/**
 * Checks if the browser supports WebGL
 * @returns {boolean} Whether WebGL is supported
 */
export const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    let gl = null;
    
    try {
      gl = canvas.getContext('webgl') || 
          canvas.getContext('experimental-webgl') || 
          canvas.getContext('webgl2');
    } catch (e) {
      console.error("Error getting WebGL context:", e);
      return false;
    }
    
    const supportsWebGL = !!(gl && gl instanceof WebGLRenderingContext);
    
    console.log("WebGL support check:", {
      hasWebGLRenderingContext: !!window.WebGLRenderingContext,
      context: gl,
      supported: supportsWebGL
    });
    
    return supportsWebGL;
  } catch (e) {
    console.error("Error checking WebGL support:", e);
    return false;
  }
};
