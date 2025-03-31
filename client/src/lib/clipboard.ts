import { toast } from "sonner"; // Assuming toast is globally available or imported where needed

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard successfully!');
    toast("Copied!"); // Give feedback
    return true; // Indicate success
  } catch (err) {
    console.error('Failed to copy text to clipboard: ', err);
    toast("Failed to copy text.", { description: "Please try again or copy manually."}); // Give feedback
    return false; // Indicate failure
  }
}