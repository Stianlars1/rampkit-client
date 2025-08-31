'use client';

import { PaletteData } from '@/types';
import styles from './ColorRamp.module.scss';
import {hexToHSL} from "@/lib/utils/color-utils";

interface ColorRampProps {
    data: PaletteData;
}

export function ColorRamp({ data }: ColorRampProps) {
    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
    };

    const renderColorStep = (color: string, index: number, type: 'accent' | 'gray') => {
        const hsl = hexToHSL(color);
        const isLight = hsl.l > 50;

        return (
            <button
                key={`${type}-${index}`}
                className={styles.colorStep}
                style={{ background: color }}
                onClick={() => copyToClipboard(color)}
                title={`Copy ${color}`}
            >
        <span className={`${styles.stepLabel} ${isLight ? styles.dark : styles.light}`}>
          {index + 1}
        </span>
                <span className={`${styles.hexValue} ${isLight ? styles.dark : styles.light}`}>
          {color}
        </span>
            </button>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Accent Colors</h3>
                <div className={styles.lightRamp}>
                    <span className={styles.modeLabel}>Light</span>
                    <div className={styles.colorGrid}>
                        {data.accentScale.light.map((color, index) =>
                            renderColorStep(color, index, 'accent')
                        )}
                    </div>
                </div>
                <div className={styles.darkRamp}>
                    <span className={styles.modeLabel}>Dark</span>
                    <div className={styles.colorGrid}>
                        {data.accentScale.dark.map((color, index) =>
                            renderColorStep(color, index, 'accent')
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Gray Colors</h3>
                <div className={styles.lightRamp}>
                    <span className={styles.modeLabel}>Light</span>
                    <div className={styles.colorGrid}>
                        {data.grayScale.light.map((color, index) =>
                            renderColorStep(color, index, 'gray')
                        )}
                    </div>
                </div>
                <div className={styles.darkRamp}>
                    <span className={styles.modeLabel}>Dark</span>
                    <div className={styles.colorGrid}>
                        {data.grayScale.dark.map((color, index) =>
                            renderColorStep(color, index, 'gray')
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}