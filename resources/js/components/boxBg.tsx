import { HTMLMotionProps, motion } from 'framer-motion';

interface BoxBgProps extends HTMLMotionProps<'img'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function BoxBg({ src, alt, width, height, className, ...motionProps }: BoxBgProps) {
    return (
        <motion.img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            {...motionProps}
        />
    );
}
