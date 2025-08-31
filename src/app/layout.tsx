import type {Metadata} from "next";
import "./globals.css";
import {assistant, dmSans, geistMono, geistSans, inter} from "@/lib/fonts/index";
import {cx} from "@/lib/utils/cx";


export const metadata: Metadata = {
    title: 'Rampkit - Beautiful Color Ramps',
    description: 'Generate beautiful 12-step color ramps from any hex color',
    keywords: 'color, palette, ramp, design, ui, ux, radix, shadcn',
    authors: [{ name: 'Rampkit' }],
    openGraph: {
        title: 'Rampkit - Beautiful Color Ramps',
        description: 'Generate beautiful 12-step color ramps from any hex color',
        url: 'https://rampkit.app',
        siteName: 'Rampkit',
        type: 'website'
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={cx(
                geistSans.variable,
                geistMono.variable,
                inter.variable,
                dmSans.variable,
                assistant.variable,
                "blue"
            )}
        >
        {children}
        </body>
        </html>
    );
}
