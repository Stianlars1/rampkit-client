import { db } from "@/lib/firebase/db";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";

const METRICS_DOC = doc(db, "metrics", "public");

async function ensureDoc() {
  const snap = await getDoc(METRICS_DOC);
  if (!snap.exists()) {
    await setDoc(
      METRICS_DOC,
      {
        createdAt: new Date(),
        visitors: 0,
        generate_clicks: 0,
        export_clicks: 0,
        export_modal_opens: 0,
        export_downloads: 0,
        devtools_copy_clicks: 0,
        export_format_counts: {}, // map<string, number>
        devtools_preset_counts: {}, // map<string, number>
        devtools_format_counts: {}, // map<string, number>,
        show_code_clicks: 0,
        hide_code_clicks: 0,
      },
      { merge: true },
    );
  }
}

export async function bumpVisitorOncePerSession() {
  await ensureDoc();
  if (typeof window === "undefined") return;
  const key = "rk.visitor.bumped";
  if (sessionStorage.getItem(key)) return;
  await updateDoc(METRICS_DOC, { visitors: increment(1) });
  sessionStorage.setItem(key, "1");
}

export async function bumpShowCode() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { show_code_clicks: increment(1) });
}

export async function bumpHideCode() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { hide_code_clicks: increment(1) });
}

export async function bumpGenerate() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { generate_clicks: increment(1) });
}

export async function bumpExportButton() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { export_clicks: increment(1) });
}

export async function bumpExportModalOpen() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { export_modal_opens: increment(1) });
}

export async function bumpExportDownload(format: string) {
  await ensureDoc();
  await updateDoc(METRICS_DOC, {
    export_downloads: increment(1),
    [`export_format_counts.${format}`]: increment(1),
  });
}

export async function bumpDevPreset(preset: string) {
  await ensureDoc();
  await updateDoc(METRICS_DOC, {
    [`devtools_preset_counts.${preset}`]: increment(1),
  });
}

export async function bumpDevFormat(format: string) {
  await ensureDoc();
  await updateDoc(METRICS_DOC, {
    [`devtools_format_counts.${format}`]: increment(1),
  });
}

export async function bumpDevCopy() {
  await ensureDoc();
  await updateDoc(METRICS_DOC, { devtools_copy_clicks: increment(1) });
}
