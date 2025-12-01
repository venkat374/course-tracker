// Layout for navbar (mobile)
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout, username } = useAuth();
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", path: "/" },
        { label: "Add Course", path: "/add-course" },
        { label: "Pomodoro", path: "/pomodoro" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <BookOpen className="h-5 w-5" />
                    <span>CourseTracker</span>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t p-4 bg-background absolute w-full shadow-lg animate-in slide-in-from-top-5">
                    <nav className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === item.path
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">
                                    Signed in as <span className="font-semibold text-foreground">{username}</span>
                                </span>
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
