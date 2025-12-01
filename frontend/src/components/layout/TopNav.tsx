import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BookOpen } from "lucide-react";

const TopNav = () => {
    const location = useLocation();
    const { logout, username } = useAuth();

    const navItems = [
        { label: "Overview", path: "/" },
        { label: "Courses", path: "/courses" },
        { label: "Pomodoro", path: "/pomodoro" },
    ];

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4 md:px-8">
                {/* Logo & Brand */}
                <div className="flex items-center gap-2 font-bold text-xl text-primary mr-8">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="hidden md:inline-block">CourseTracker</span>
                </div>

                {/* Main Navigation */}
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                location.pathname === item.path
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 w-[200px] lg:w-[300px] bg-muted/50"
                        />
                    </div>

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt={username || "User"} />
                                    <AvatarFallback>{username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{username}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
