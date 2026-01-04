import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";

// Opt into the Node.js runtime for this route.  The default is `edge`
// which cannot bundle npm modules like JSZip.
export const runtime = "nodejs";

// POST handler for the export endpoint.  The client sends a JSON body
// containing an array of file descriptors (`path` and `contents`) and an
// optional `zipName`.  We build a ZIP archive using JSZip and return it
// as a binary response with the appropriate content disposition header.
export async function POST(req: NextRequest) {
  const payload = (await req.json()) as {
    files: { path: string; contents: string }[];
    zipName?: string;
  };

  const zip = new JSZip();
  for (const f of payload.files) {
    zip.file(f.path, f.contents);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = payload.zipName ?? "typography.zip";
  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
