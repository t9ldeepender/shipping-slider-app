// Function to add a timeout to fetch requests
export async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      console.error("Network request timed out or failed:", error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  // Function to retry fetch requests with a set number of retries
  export async function fetchWithRetry(url, options, retries = 3, timeout = 10000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchWithTimeout(url, options, timeout);
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed. Retrying...`, error);
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }
  