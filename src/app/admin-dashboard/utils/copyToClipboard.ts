export const copyToClipboard = async (text: string, onSuccess?: () => void) => {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess?.();
  } catch (err) {
    console.error("Failed to copy text: ", err);
    throw err; // Allow calling code to handle errors
  }
};
