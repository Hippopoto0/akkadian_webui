import { toast } from "sonner";

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard successfully!');
    toast("Copied!");
    return true;
  } catch (err) {
    console.error('Failed to copy text to clipboard: ', err);
    toast("Failed to copy text.", { description: "Please try again or copy manually."});
    return false;
  }
}