/**
 * Triggers a local file download using a Blob URL.
 * No generated values leave the browser.
 */
export function downloadTextFile(
  contents: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Release the blob URL on the next task so browsers can start the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function createSecretsFilename(prefix = "cipherforge-secrets"): string {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `${prefix}-${stamp}.txt`;
}
