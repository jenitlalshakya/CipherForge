/**
 * Copies a value to the local clipboard.
 *
 * The value is never logged or persisted by CipherForge. A legacy textarea
 * fallback is used only when the asynchronous Clipboard API is unavailable
 * (for example, on an insecure origin).
 */
export async function copyToClipboard(value: string): Promise<boolean> {
  if (!value) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the local textarea fallback.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    const copied = document.execCommand("copy");
    textarea.remove();

    return copied;
  } catch {
    return false;
  }
}
