import {ButtonHTMLAttributes} from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    ref?: React.Ref<HTMLButtonElement>;
}

export const Button = (
    ({className = '', variant = 'primary', size = 'md', children,ref, ...props}: ButtonProps) => {
        return (
            <button
                ref={ref}
                className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

