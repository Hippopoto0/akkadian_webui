/**
 * Fetches the English translation for a given Akkadian text.
 * @param akkadianText - The Akkadian text to translate.
 * @returns A promise that resolves with the English translation string.
 * @throws An error if the fetch operation fails or the API returns an error.
 */
export async function fetchAkkadianTranslation(akkadianText: string): Promise<string> {
  const fetchAkkadianURL = import.meta.env.VITE_AKKADIAN_URL;

  if (!fetchAkkadianURL) {
      console.error("Error: VITE_AKKADIAN_URL is not defined in .env");
      throw new Error("Translation service URL is not configured.");
  }
  if (!akkadianText || akkadianText.trim() === '') {
      throw new Error("Input text cannot be empty.");
  }

  try {
    const response = await fetch(fetchAkkadianURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: akkadianText }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      console.error("Error fetching translation:", errorData);
      // Try to provide a more specific error message if available
      throw new Error(errorData?.message || `Translation request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Adjust based on your actual API response structure
    if (data && typeof data.message === 'string') {
      return data.message;
    } else {
      console.error("Unexpected response structure:", data);
      throw new Error("Received an unexpected response format from the translation service.");
    }
  } catch (error) {
    console.error("Network or other error fetching translation:", error);
    // Re-throw the error to be caught by the caller, potentially customizing it
    throw error instanceof Error ? error : new Error("An unknown error occurred during translation.");
  }
}
