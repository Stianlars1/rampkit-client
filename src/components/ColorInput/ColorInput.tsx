'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Scheme } from '@/types';
import styles from './ColorInput.module.scss';
import {isValidHex} from "@/lib/utils/color-utils";

interface ColorInputProps {
    onGenerate: (hex: string, scheme: Scheme) => void;
    loading?: boolean;
}

const schemes: { value: Scheme; label: string }[] = [
    { value: 'analogous', label: 'Analogous' },
    { value: 'complementary', label: 'Complementary' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'monochromatic', label: 'Monochromatic' }
];

export function ColorInput({ onGenerate, loading }: ColorInputProps) {
    const [hex, setHex] = useState('#3B82F6');
    const [scheme, setScheme] = useState<Scheme>('analogous');
    const [error, setError] = useState('');

    const handleGenerate = () => {
        if (!isValidHex(hex)) {
            setError('Please enter a valid hex color (e.g., #3B82F6)');
            return;
        }

        setError('');
        onGenerate(hex, scheme);
    };

    const handleHexChange = (value: string) => {
        setHex(value);
        if (error && isValidHex(value)) {
            setError('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Rampkit</h1>
                <p className={styles.subtitle}>
                    Generate beautiful 12-step color ramps from any hex color
                </p>
            </div>

            <div className={styles.form}>
                <div className={styles.inputGroup}>
                    <div className={styles.colorInputWrapper}>
                        <Input
                            type="text"
                            placeholder="#3B82F6"
                            value={hex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            error={error}
                        />
                        <div
                            className={styles.colorPreview}
                            style={{
                                background: isValidHex(hex) ? hex : 'hsl(var(--muted))'
                            }}
                        />
                    </div>

                    <select
                        className={styles.select}
                        value={scheme}
                        onChange={(e) => setScheme(e.target.value as Scheme)}
                    >
                        {schemes.map(s => (
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
                    {loading ? 'Generating...' : 'Generate Ramp'}
                </Button>
            </div>
        </div>
    );
}