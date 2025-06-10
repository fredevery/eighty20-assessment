import { motion } from 'motion/react';

import styles from './Frame.module.css';

export default function Frame({ children, className, error }: { children: React.ReactNode, className?: string, error?: boolean }) {
    return (
        <div className={className}>
            <motion.div className={[styles.frameContainer, error && styles.frameContainerError].filter(Boolean).join(' ')}
                initial={{ scale: 0.8, opacity: 0}}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0}}>
                { children }
            </motion.div>
        </div>
    );

}