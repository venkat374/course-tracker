import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";

interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    dateEarned: string;
}

interface BadgesProps {
    badges: Badge[];
}

const Badges: React.FC<BadgesProps> = ({ badges }) => {
    if (!badges || badges.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No badges earned yet. Keep learning!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className="flex flex-col items-center text-center p-3 border rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors animate-in zoom-in-50 duration-500"
                        >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                            <BadgeUI variant="outline" className="text-[10px]">
                                {new Date(badge.dateEarned).toLocaleDateString()}
                            </BadgeUI>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Badges;
