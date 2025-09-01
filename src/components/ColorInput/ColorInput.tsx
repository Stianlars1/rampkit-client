"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { Scheme } from "@/types";
import styles from "./ColorInput.module.scss";
import { isValidHex } from "@/lib/utils/color-utils";
import { useMetrics } from "@/hooks/useMetrics";

interface ColorInputProps {
  onGenerate: (hex: string, scheme: Scheme) => void;
  loading?: boolean;
}

const schemes: { value: Scheme; label: string }[] = [
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
  { value: "monochromatic", label: "Monochromatic" },
];

export function ColorInput({ onGenerate, loading }: ColorInputProps) {
  const [hex, setHex] = useState("#3B82F6");
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [error, setError] = useState("");

  const { trackGenerate } = useMetrics();

  const handleGenerate = () => {
    if (!isValidHex(hex)) {
      setError("Please enter a valid hex color (e.g., #3B82F6)");
      return;
    }

    setError("");
    trackGenerate(hex, scheme);
    onGenerate(hex, scheme);
  };

  const normalizeHex = (value: string) => {
    if (value && !value.startsWith("#")) {
      return `#${value}`;
    }
    return value;
  };

  const removeHexCharacter = (value: string) => {
    if (value && !value.startsWith("#")) {
      return value;
    } else {
      return value.slice(1);
    }
  };

  const handleHexChange = (value: string) => {
    const normalizedValue = normalizeHex(value);
    setHex(normalizedValue);

    if (error && isValidHex(normalizedValue)) {
      setError("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.colorInputWrapper}>
            <Input
              type="text"
              placeholder="#3B82F6"
              value={removeHexCharacter(hex)}
              onChange={(e) => handleHexChange(e.target.value)}
              error={error}
              className={styles.colorInput}
            />
            <div
              className={styles.colorPreview}
              style={{
                background: isValidHex(hex) ? hex : "transparent",
              }}
            />
          </div>

          <select
            className={styles.select}
            value={scheme}
            onChange={(e) => setScheme(e.target.value as Scheme)}
          >
            {schemes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !isValidHex(hex)}
          size="lg"
        >
          {loading ? "Generating..." : "Generate Palette"}
        </Button>
      </div>
    </div>
  );
}
