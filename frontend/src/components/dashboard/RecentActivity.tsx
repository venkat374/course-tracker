import { ScrollArea } from "@/components/ui/scroll-area"

interface Activity {
    id: string;
    courseName: string;
    action: string;
    time: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    if (activities.length === 0) {
        return <div className="text-sm text-muted-foreground">No recent activity.</div>;
    }

    return (
        <ScrollArea className="h-[300px]">
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" key={activity.id}>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.courseName}</p>
                            <p className="text-xs text-muted-foreground">
                                {activity.action}
                            </p>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
