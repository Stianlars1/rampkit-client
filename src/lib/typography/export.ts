// src/lib/typography/utils/export.ts
export async function exportAllAsZip(
  files: { path: string; contents: string }[],
  filename = "typography.zip",
) {
  const res = await fetch("/api/typography/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error("Failed to generate ZIP");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
