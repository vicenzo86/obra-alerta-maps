
/**
 * Utility functions for WebGL detection and support
 */

/**
 * Checks if the browser supports WebGL
 * @returns {boolean} Whether WebGL is supported
 */
export const checkWebGLSupport = (): boolean => {
  try {
    // Mobile browser check
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    console.log("Device detection:", { isMobile, userAgent });
    
    const canvas = document.createElement('canvas');
    let gl = null;
    
    try {
      // Try to get WebGL context
      gl = canvas.getContext('webgl') || 
          canvas.getContext('experimental-webgl') || 
          canvas.getContext('webgl2');
    } catch (e) {
      console.error("Error getting WebGL context:", e);
      return false;
    }
    
    // Check if the context is valid and is a WebGLRenderingContext
    const supportsWebGL = !!(gl && gl instanceof WebGLRenderingContext);
    
    // Additional check for mobile devices - sometimes they report WebGL support but can't actually use it
    if (supportsWebGL && isMobile) {
      // Try to execute a simple WebGL operation
      try {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      } catch (e) {
        console.error("Error executing WebGL commands on mobile:", e);
        return false;
      }
    }
    
    console.log("WebGL support check:", {
      hasWebGLRenderingContext: !!window.WebGLRenderingContext,
      context: gl,
      contextValid: !!gl,
      isCorrectInstance: !!(gl && gl instanceof WebGLRenderingContext),
      supported: supportsWebGL
    });
    
    return supportsWebGL;
  } catch (e) {
    console.error("Error checking WebGL support:", e);
    return false;
  }
};

/**
 * Checks if the device is a mobile device
 * @returns {boolean} Whether the device is mobile
 */
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
};
