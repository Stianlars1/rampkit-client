"use client";
import {useEffect, useState} from "react";
import styles from "./LoadingTips.module.scss"

export const LoadingTips = () => {
    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <div>
                {/* Explain to the user that it takes around 20 seconds to extract the color steps from Radix */}
                <p>
                    ?? Tip: This process can take up to 20 seconds. Please be patient while we generate your color palette.
                    {countdown > 0 && ` (${countdown}s remaining)`}
                </p>
            </div>
        </div>
    );
}