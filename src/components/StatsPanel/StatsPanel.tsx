"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import styles from "./StatsPanel.module.scss";

type CountMap = Record<string, number>;

type MetricsDoc = {
  visitors: number;
  generate_clicks: number;
  export_clicks: number;
  export_modal_opens: number;
  export_downloads: number;
  export_format_counts: CountMap;

  devtools_copy_clicks: number;
  devtools_preset_counts: CountMap;
  devtools_format_counts: CountMap;

  hide_code_clicks: number;
  show_code_clicks: number;
};

//

export function StatsPanel() {
  const [metrics, setMetrics] = useState<MetricsDoc | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) return;
    const ref = doc(db, "metrics", "public");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMetrics(snap.data() as MetricsDoc);
      }
    });
    return () => unsub();
  }, []);

  if (!metrics) return null;

  const top = (map: CountMap) =>
    Object.entries(map)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, 5);

  return (
    <div className={styles.panel}>
      <h2>Live Stats</h2>

      <div className={styles.grid}>
        <Stat label="Visitors" value={metrics.visitors} />
        <Stat label="Generated ramps" value={metrics.generate_clicks} />
        <Stat label="Clicks export" value={metrics.export_clicks} />
        <Stat label="Export downloads" value={metrics.export_downloads} />
        <Stat label="Dev-tools copy" value={metrics.devtools_copy_clicks} />
      </div>

      <div className={styles.lists}>
        <OptionList
          title="Top export formats"
          items={top(metrics.export_format_counts)}
        />
        <OptionList
          title="Top presets"
          items={top(metrics.devtools_preset_counts)}
        />
        <OptionList
          title="Top color formats"
          items={top(metrics.devtools_format_counts)}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.value}>{value ?? 0}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

function OptionList({
  title,
  items,
}: {
  title: string;
  items: [string, number][];
}) {
  return (
    <div className={styles.stats}>
      <h3 className={styles.title}>{title}</h3>
      {items.length === 0 ? (
        <p className={styles.empty}>No data yet</p>
      ) : (
        <ul className={styles.list}>
          {items.map(([k, v]) => (
            <li className={styles.item} key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
