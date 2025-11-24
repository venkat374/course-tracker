import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TopNavLayout from "@/components/layout/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const Pomodoro: React.FC = () => {
  const { authToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Timer state
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  // Course state
  const [courses, setCourses] = useState<{ _id: string; courseName: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Settings state
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!authToken) return;
      try {
        const res = await axios.get(`${backendUrl}/auth/pomodoro`, {
          headers: { "x-auth-token": authToken },
        });
        if (res.data) {
          setFocusDuration(res.data.focusMinutes || 25);
          setBreakDuration(res.data.breakMinutes || 5);
          // Only update current timer if not active and matches default/previous
          if (!isActive) {
            setMinutes(res.data.focusMinutes || 25);
          }
        }

        // Fetch courses for dropdown
        const coursesRes = await axios.get(`${backendUrl}/courses`, {
          headers: { "x-auth-token": authToken },
        });
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Failed to fetch settings or courses", error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();

    // Request Notification Permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Initialize audio
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, [authToken]);

  // Handle Timer Completion
  const handleTimerComplete = () => {
    setIsActive(false);

    // Play Sound 5 times
    if (soundEnabled && audioRef.current) {
      let plays = 0;
      const playSound = () => {
        if (plays < 5) {
          audioRef.current?.play().catch(e => console.error("Audio play failed", e));
          plays++;
          setTimeout(playSound, 1000); // Play every second
        }
      };
      playSound();
    }

    // Show Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Timer Finished!", {
        body: mode === "focus" ? "Focus session complete! Take a break." : "Break over! Time to focus.",
        icon: "/favicon.ico"
      });
    }

    // Save session if it was a focus session
    if (mode === "focus" && authToken) {
      saveSession();
    }

    // Auto-switch mode (optional, but good UX)
    if (mode === "focus") {
      setMode("break");
      setMinutes(breakDuration);
      setSeconds(0);
    } else {
      setMode("focus");
      setMinutes(focusDuration);
      setSeconds(0);
    }
  };

  const saveSession = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/pomodoro/log`,
        { minutes: focusDuration, courseId: selectedCourseId || null },
        { headers: { "x-auth-token": authToken } }
      );
    } catch (error) {
      console.error("Failed to save pomodoro session", error);
    }
  };

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          handleTimerComplete();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "focus" ? focusDuration : breakDuration);
    setSeconds(0);
  };

  const handleModeSwitch = (newMode: "focus" | "break") => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(newMode === "focus" ? focusDuration : breakDuration);
    setSeconds(0);
  };

  // Save Settings
  const saveSettings = async () => {
    try {
      if (authToken) {
        await axios.put(
          `${backendUrl}/auth/pomodoro`,
          { focusMinutes: focusDuration, breakMinutes: breakDuration },
          { headers: { "x-auth-token": authToken } }
        );
      }
      setShowSettings(false);
      resetTimer();
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  }

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Calculate Progress
  const totalSeconds = mode === "focus" ? focusDuration * 60 : breakDuration * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  // Prevent "crazy" visual glitch by clamping progress and disabling transition on reset
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isResetting = clampedProgress === 0;

  return (
    <TopNavLayout>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Focus Timer</h1>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {showSettings && (
          <Card className="mb-6 animate-in slide-in-from-top-5">
            <CardHeader>
              <CardTitle className="text-lg">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="focusDuration">Focus (min)</Label>
                  <Input
                    id="focusDuration"
                    type="number"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    min={1}
                    max={60}
                  />
                </div>
                <div>
                  <Label htmlFor="breakDuration">Break (min)</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    min={1}
                    max={30}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Sound Notifications</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  {soundEnabled ? "On" : "Off"}
                </Button>
              </div>
              <Button className="w-full" onClick={saveSettings}>
                Save & Reset
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <Label htmlFor="courseSelect" className="mb-2 block">Select Course (Optional)</Label>
          <select
            id="courseSelect"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={isActive}
          >
            <option value="">-- General Focus --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <Card className="text-center py-8">
          <CardContent>
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={mode === "focus" ? "default" : "outline"}
                onClick={() => handleModeSwitch("focus")}
                className="w-24"
              >
                Focus
              </Button>
              <Button
                variant={mode === "break" ? "default" : "outline"}
                onClick={() => handleModeSwitch("break")}
                className="w-24"
              >
                Break
              </Button>
            </div>

            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              {/* Circular Progress Background */}
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - clampedProgress / 100)}
                  className={cn(
                    "ease-linear",
                    !isResetting && "transition-all duration-1000",
                    mode === "focus" ? "text-primary" : "text-green-500"
                  )}
                  strokeLinecap="round"
                />
              </svg>

              <div className="text-6xl font-bold tabular-nums tracking-tighter">
                {loadingSettings ? "..." : formatTime(minutes, seconds)}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="w-32 h-12 text-lg"
                onClick={toggleTimer}
                variant={isActive ? "secondary" : "default"}
              >
                {isActive ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" /> Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-12 px-0"
                onClick={resetTimer}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TopNavLayout>
  );
};

export default Pomodoro;
