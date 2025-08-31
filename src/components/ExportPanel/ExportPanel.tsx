'use client';

import { useState } from 'react';
import { PaletteData, ExportOptions, StylePreset, ColorFormat } from '@/types';
import { Button } from '@/components/ui/Button/Button';
import { generateExportCode } from '@/lib/export-formats';
import styles from './ExportPanel.module.scss';

interface ExportPanelProps {
    data: PaletteData;
}

const stylePresets: { value: StylePreset; label: string }[] = [
    { value: 'shadcn', label: 'shadcn/ui' },
    { value: 'radix', label: 'Radix Colors' },
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'css-variables', label: 'CSS Variables' },
    { value: 'css-in-js', label: 'CSS-in-JS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'material-ui', label: 'Material-UI' },
    { value: 'chakra-ui', label: 'Chakra UI' }
];

const colorFormats: { value: ColorFormat; label: string }[] = [
    { value: 'HEX', label: 'HEX' },
    { value: 'RGB', label: 'RGB' },
    { value: 'HSL', label: 'HSL' },
    { value: 'HSL_VALUES', label: 'HSL Values' },
    { value: 'OKLAB', label: 'OKLAB' },
    { value: 'OKLCH', label: 'OKLCH' }
];

export function ExportPanel({ data }: ExportPanelProps) {
    const [options, setOptions] = useState<ExportOptions>({
        preset: 'shadcn',
        format: 'HSL_VALUES'
    });
    const [showCode, setShowCode] = useState(false);
    const [copied, setCopied] = useState(false);

    const code = generateExportCode(data, options);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label className={styles.label}>Style Preset</label>
                    <select
                        className={styles.select}
                        value={options.preset}
                        onChange={(e) => setOptions(prev => ({
                            ...prev,
                            preset: e.target.value as StylePreset
                        }))}
                    >
                        {stylePresets.map(preset => (
                            <option key={preset.value} value={preset.value}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label}>Color Format</label>
                    <select
                        className={styles.select}
                        value={options.format}
                        onChange={(e) => setOptions(prev => ({
                            ...prev,
                            format: e.target.value as ColorFormat
                        }))}
                    >
                        {colorFormats.map(format => (
                            <option key={format.value} value={format.value}>
                                {format.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    onClick={() => setShowCode(!showCode)}
                    variant="outline"
                >
                    {showCode ? 'Hide Code' : 'Show Code'}
                </Button>
            </div>

            {showCode && (
                <div className={styles.codeContainer}>
                    <div className={styles.codeHeader}>
            <span className={styles.codeTitle}>
              {stylePresets.find(p => p.value === options.preset)?.label} • {' '}
                {colorFormats.find(f => f.value === options.format)?.label}
            </span>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <pre className={styles.codeBlock}>
            <code>{code}</code>
          </pre>
                </div>
            )}
        </div>
    );
}