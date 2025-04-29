import { FC } from 'react';

interface WelcomeLogoProps {
    src?: string;
    alt?: string;
    width?: number; // Tailwind size for width (e.g., 48 = w-48)
    height?: number; // Tailwind size for height (e.g., 16 = h-16)
    className?: string;
}

const WelcomeLogo: FC<WelcomeLogoProps> = ({ src = '/images/logo.png', alt = 'Tasko Logo', width = 48, height = 16, className = '' }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`mb-4 w-${width} h-${height} sm:w-${Math.floor(width * 0.75)} sm:h-${Math.floor(height * 0.75)} rounded-md shadow-md ${className}`}
        />
    );
};

export default WelcomeLogo;
