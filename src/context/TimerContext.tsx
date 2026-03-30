'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useTimer } from '@/hooks/useTimer';

const TimerContext = createContext<any>(null);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const timer = useTimer();

    const formatTime = useCallback((s: number) => {
        const hrs = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60);
        const secs = s % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const downloadReport = () => {
        if (!timer.logs || timer.logs.length === 0) return;
        const header = "ЗВІТ РОБОЧОГО ЧАСУ\n" + "=".repeat(30) + "\n\n";
        const body = timer.logs.map((l: any, i: number) => 
            `${timer.logs.length - i}. [${l.systemTime}] — Таймер: ${l.timerValue}\n   Коментар: ${l.comment}`
        ).join('\n\n');
        const file = new Blob([header + body], { type: 'text/plain' });
        const element = document.body.appendChild(document.createElement("a"));
        element.href = URL.createObjectURL(file);
        element.download = `work_log.txt`;
        element.click();
        document.body.removeChild(element);
    };

    const value = useMemo(() => ({
        ...timer,
        formatTime,
        downloadReport
    }), [timer.seconds, timer.isActive, timer.logs, formatTime]);

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) throw new Error("useTimerContext must be used within a TimerProvider");
    return context;
};