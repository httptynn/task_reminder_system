import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import WelcomeLogo from '../components/WelcomeLogo';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [displayText, setDisplayText] = useState('');
    const fullText = 'Welcome to Tasko!';

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-hidden pt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D1226] to-[#10162C]" />

                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#036BFF_0%,transparent_70%)] opacity-10" />
                    <div className="absolute inset-0 animate-pulse">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-1 w-1 animate-ping rounded-full bg-white opacity-30"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${Math.random() * 3 + 2}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Adding more parallax layers */}
                <div className="absolute inset-0 z-0" style={{ transform: 'translateZ(-1px) scale(2)', background: 'rgba(0, 0, 0, 0.5)' }} />
                <svg
                    className="animate-float-slow absolute top-10 left-10 h-16 w-16 text-[#036BFF] opacity-20"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                >
                    <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className="animate-float-fast absolute right-16 bottom-16 h-12 w-12 text-[#ffffff33]" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" rx="20" />
                </svg>

                <div
                    className="relative z-10 flex min-h-screen flex-col items-center justify-start p-6 pt-6 text-white lg:p-8"
                    onMouseMove={(e) => {
                        const x = (e.clientX / window.innerWidth - 0.5) * 30; // Increased movement
                        const y = (e.clientY / window.innerHeight - 0.5) * 30; // Increased movement
                        document.documentElement.style.setProperty('--x', `${x}px`);
                        document.documentElement.style.setProperty('--y', `${y}px`);
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex w-full max-w-[335px] flex-col items-center gap-4 lg:max-w-2xl"
                    >
                        <WelcomeLogo
                            src="/images/logo.png"
                            alt="Tasko Logo"
                            width={60}
                            height={30}
                            className="relative z-20 drop-shadow-[0_0_8px_#036BFF99]"
                        />

                        <div className="text-center">
                            <h1 className="glow mb-1 text-3xl font-semibold tracking-tight text-[#bluewhite]">
                                <span className="typewriter-animation">{displayText}</span>
                            </h1>
                            <p className="text-sm text-white/80">
                                The smarter way to <strong className="text-lg text-[#036BFF]"> track</strong>,
                                <strong className="text-lg font-bold text-[#036BFF]"> plan</strong>, and
                                <strong className="text-lg font-bold text-[#036BFF]"> thrive</strong>—one task at a time. One task at a time. Log in
                                to pick up where you left off, or create a new account to start managing your goals with ease. Let’s get things done —{' '}
                                <span className="text-lg font-bold text-[#036BFF]">together</span>.
                            </p>
                        </div>

                        {/* Add margin to create space between description and buttons */}
                        <nav className="mt-20 flex w-full flex-col items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('Task')}
                                    className="relative z-20 inline-block w-full max-w-[300px] rounded-xl border border-[#036BFF] bg-gradient-to-r from-[#036BFF]/70 via-[#1A1A31] to-[#0D1226] px-10 py-3 text-center text-base font-semibold text-white shadow-[0_0_6px_#036BFF66] transition-all duration-200 hover:bg-[#036BFF]/80"
                                >
                                    Task
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="relative z-20 inline-block w-full max-w-[300px] rounded-xl bg-[#1A1A31]/90 px-10 py-3 text-center text-base font-semibold text-white shadow-[0_0_6px_#036BFF33] ring-1 ring-[#036BFF]/20 transition-all duration-200 hover:scale-105 hover:ring-[#036BFF]/40"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="relative z-20 inline-block w-full max-w-[300px] rounded-xl border border-[#036BFF] bg-gradient-to-r from-[#036BFF]/70 via-[#1A1A31] to-[#0D1226] px-10 py-3 text-center text-base font-semibold text-white shadow-[0_0_6px_#036BFF66] transition-all duration-200 hover:bg-[#036BFF]/80"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                </div>
            </div>

            <style>{`
                :root {
                    --x: 0px;
                    --y: 0px;
                }
                .glow {
                    text-shadow:
                        0 0 8px #036bff,
                        0 0 12px #036bff80;
                }
                .animate-float-slow {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0) translateX(var(--x)) translateY(var(--y));
                    }
                    50% {
                        transform: translateY(-10px) translateX(calc(var(--x) * 1.2)) translateY(calc(var(--y) * 1.2));
                    }
                }
            `}</style>
        </>
    );
}
