import React from "react";
import TopNav from "./TopNav";

interface TopNavLayoutProps {
    children: React.ReactNode;
}

const TopNavLayout: React.FC<TopNavLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <TopNav />
            <main className="flex-1 p-4 md:p-8 pt-6">
                {children}
            </main>
        </div>
    );
};

export default TopNavLayout;
