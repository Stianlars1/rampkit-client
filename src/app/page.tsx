'use client';

import { useState } from 'react';
import { ColorInput } from '@/components/ColorInput/ColorInput';
import { ColorRamp } from '@/components/ColorRamp/ColorRamp';
import { ExportPanel } from '@/components/ExportPanel/ExportPanel';
import { PaletteData, Scheme } from '@/types';
import styles from './page.module.scss';
import {generatePalette} from "@/app/actions/generatePalette";

export default function HomePage() {
    const [paletteData, setPaletteData] = useState<PaletteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (hex: string, scheme: Scheme) => {
        try {
            setLoading(true);
            setError('');

            const data = await generatePalette(hex, scheme);
            setPaletteData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate palette');
            console.error('Generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <ColorInput onGenerate={handleGenerate} loading={loading} />

                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                )}

                {paletteData && (
                    <div className={styles.results}>
                        <ColorRamp data={paletteData} />
                        <ExportPanel data={paletteData} />
                    </div>
                )}
            </main>

            <footer className={styles.footer}>
                <p>Built with Rampkit API • Open Source</p>
            </footer>
        </div>
    );
}