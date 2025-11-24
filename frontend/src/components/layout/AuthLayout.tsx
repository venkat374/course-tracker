import React from "react";
import { BookOpen } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
                <BookOpen className="h-8 w-8" />
                <span>CourseTracker</span>
            </div>
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
