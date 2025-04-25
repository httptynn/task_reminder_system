import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { motion } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    const headerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.75,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const headingVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.75,
                ease: "easeOut",
                delay: 0.4
            }
        }
    };

    const paragraphVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.75,
                ease: "easeOut",
                delay: 0.6
            }
        }
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="reconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link rel="reload" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" />
            </Head>
            <div 
                className={`flex min-h-screen flex-col items-center text-white ${isMobile ? 'p-4' : 'p-6 lg:p-8 lg:justify-center'}`}
                style={{ 
                    backgroundImage: `url(/images/sign.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <motion.header 
                    className={`w-full text-sm ${isMobile ? 'max-w-[300px]' : 'max-w-[335px] lg:max-w-4xl max-mb-[100px]'}`}
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className={`inline-block rounded-sm border border-transparent px-5 py-1.5 leading-normal text-white hover:border-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className={`inline-block rounded-sm border border-transparent px-5 py-1.5 leading-normal text-white hover:border-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className={`inline-block rounded-sm border border-gray-300 px-5 py-1.5 leading-normal text-white hover:border-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </motion.header>
                <div className={`flex w-full items-center justify-center opacity-100 transition-opacity duration-750 ${isMobile ? '' : 'lg:grow'}`}>
    <main className={`flex w-full flex-col items-center ${isMobile ? 'max-w-[300px]' : 'max-w-[335px] lg:max-w-4xl'}`}>
        <motion.img 
            src="/images/the-logo.png" 
            alt="Tasko Logo" 
            className={`${isMobile ? 'w-36' : 'w-48 lg:w-64'}`}
            variants={logoVariants}
            initial="hidden"
            animate="visible"
        />
        <motion.h1 
            className={`font-bold text-blue-300 ${isMobile ? 'text-xl' : 'text-3xl'}`}
            variants={headingVariants}
            initial="hidden"
            animate="visible"
        >
            Make Every Task Count!
        </motion.h1>
        <motion.p 
            className={`mt-2 text-center text-blue-300 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'}`}
            variants={paragraphVariants}
            initial="hidden"
            animate="visible"
        >
            Conquer your tasks with ease! Tasko keeps you organized, focused, and<br />
            ahead of deadlines—because your time matters.<br />
            Sign in to access your account & explore exclusive features.
        </motion.p>
    </main>
</div>
            </div>
        </>
    );
}