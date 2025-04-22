import { HTMLMotionProps, motion } from 'framer-motion';

interface AbstractLogoProps extends HTMLMotionProps<'img'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function AbstractLogo({ src, alt, width, height, className, ...motionProps }: AbstractLogoProps) {
    return (
        <motion.img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            {...motionProps}
        />
    );
}
