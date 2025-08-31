import { Scheme, PaletteData } from '@/types';
import {RAMPKIT_API_URL} from "@/lib/utils/urls";

const API_BASE = process.env.NODE_ENV === 'production'
    ? RAMPKIT_API_URL
    : 'http://localhost:3000';

export async function generatePalette(hex: string, scheme: Scheme): Promise<PaletteData> {
    const response = await fetch(`${API_BASE}/api/generate-palette`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hex, scheme })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
}