import AbstractLogo from '@/components/AbstractLogo';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import WelcomeLogo from '@/components/WelcomeLogo';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const [displayText, setDisplayText] = useState('');
    const fullText = 'Forgot password';

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot password">
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

                <div className="absolute inset-0 z-0" style={{ transform: 'translateZ(-1px) scale(2)', background: 'rgba(0, 0, 0, 0.5)' }} />
                <svg
                    className="animate-float-slow absolute top-12 left-12 h-16 w-16 text-[#036BFF] opacity-20"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                >
                    <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className="animate-float-fast absolute right-16 bottom-20 h-12 w-12 text-[#ffffff33]" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" rx="20" />
                </svg>

                <div
                    className="relative z-10 flex min-h-screen flex-col items-center justify-start p-6 pt-6 text-white lg:p-8"
                    onMouseMove={(e) => {
                        const x = (e.clientX / window.innerWidth - 0.5) * 30;
                        const y = (e.clientY / window.innerHeight - 0.5) * 30;
                        document.documentElement.style.setProperty('--x', `${x}px`);
                        document.documentElement.style.setProperty('--y', `${y}px`);
                    }}
                >
                    <AbstractLogo
                        src="/images/AbstractLogo.png"
                        alt="Abstract Logo"
                        width={55}
                        height={55}
                        className="absolute top-6 left-6 z-20 drop-shadow-[0_0_6px_#036BFF99] transition-transform duration-200 hover:scale-110"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex w-full max-w-[300px] flex-col items-center gap-4 lg:max-w-[400px]"
                    >
                        <WelcomeLogo
                            src="/images/logo.png"
                            alt="Tasko Logo"
                            width={20}
                            height={10}
                            className="relative z-20 drop-shadow-[0_0_8px_#036BFF99]"
                        />

                        <div className="mb-2 text-center">
                            <h1 className="glow mb-1 text-2xl font-semibold tracking-tight text-white">
                                <span className="typewriter-animation">{displayText}</span>
                            </h1>
                        </div>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                        <form className="flex w-full flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-8 rounded-xl border border-[#036BFF] bg-[#0C0C18]/100 px-4 py-6 shadow-[0_0_6px_#036BFF33]">
                                <div className="text-center">
                                    <p className="text-xs text-white/80">
                                        Enter your <strong className="text-base text-[#036BFF]">email</strong> to receive a password reset link.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    <Label htmlFor="email" className="text-white">
                                        Email address
                                    </Label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full rounded-xl bg-[#1A1A31]/90 px-4 py-2 text-white placeholder-white/50 ring-1 ring-[#036BFF]/20 focus:ring-[#036BFF]/40"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <button
                                    type="submit"
                                    tabIndex={2}
                                    disabled={processing}
                                    className="relative z-20 inline-block w-full rounded-xl border border-[#036BFF] bg-[#036BFF] px-6 py-2 text-center text-base font-semibold text-white shadow-[0_0_6px_#036BFF66] transition-all duration-200 hover:bg-[#0259E6] disabled:opacity-50"
                                >
                                    {processing && <LoaderCircle className="mr-2 inline-block h-4 w-4 animate-spin" />}
                                    Email password reset link
                                </button>
                            </div>

                            <div className="text-center text-sm text-white/80">
                                Return to{' '}
                                <TextLink href={route('login')} className="text-[#036BFF] hover:underline" tabIndex={3}>
                                    Log in
                                </TextLink>
                            </div>
                        </form>
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
