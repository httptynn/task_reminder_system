// import AppLogoIcon from '@/components/app-logo-icon';
// import { Link } from '@inertiajs/react';
// import { type PropsWithChildren } from 'react';

// interface AuthLayoutProps {
//     name?: string;
//     title?: string;
//     description?: string;
// }

// export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
//     return (
//         <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//             <div className="w-full max-w-sm">
//                 <div className="flex flex-col gap-8">
//                     <div className="flex flex-col items-center gap-4">
//                         <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
//                             <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
//                                 <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
//                             </div>
//                             <span className="sr-only">{title}</span>
//                         </Link>

//                         <div className="space-y-2 text-center">
//                             <h1 className="text-xl font-medium">{title}</h1>
//                             <p className="text-muted-foreground text-center text-sm">{description}</p>
//                         </div>
//                     </div>
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

import { type PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div 
            className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
            style={{ backgroundImage: 'url(/images/login.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                <motion.img 
                    src="/images/the-logo.png" 
                    alt="Logo" 
                    className="h-14 w-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                />
                <span className="sr-only">{title}</span>
            </Link>
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
            >
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}