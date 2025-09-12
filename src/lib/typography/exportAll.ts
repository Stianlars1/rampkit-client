// Helper for exporting all generated files as a ZIP archive.  The function
// posts to our API route at `/api/typography/export` and triggers a
// download of the returned binary.  It runs entirely on the client.

export async function exportAllAsZip(files: { path: string; contents: string }[], zipName: string) {
  const res = await fetch("/api/typography/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files, zipName }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Export failed: ${text}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}