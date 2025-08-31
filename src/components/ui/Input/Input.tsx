import {InputHTMLAttributes, Ref} from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    className?: string;
    ref?: Ref<HTMLInputElement>;

}

export const Input = (
    ({className = '', error, ref, ...props}: InputProps) => {
        return (
            <div className={styles.wrapper}>
                <input
                    ref={ref}
                    className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                    {...props}
                />
                {error && <span className={styles.errorText}>{error}</span>}
            </div>
        );
    }
);