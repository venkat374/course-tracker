import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Pomodoro = () => {
  const { authToken } = useAuth();

  const [focus, setFocus] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus");

  const intervalRef = useRef(null);
  const soundRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load the sound ONE time
  useEffect(() => {
    soundRef.current = new Audio("/sounds/ding.mp3");
  }, []);

  // Ask for notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    }
  };

  // Fetch settings after authToken is ready
  useEffect(() => {
    if (!authToken) return;

    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth/pomodoro`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const f = res.data.focusMinutes;
        const b = res.data.breakMinutes;

        setFocus(f);
        setBreakTime(b);

        // Reset timer on load
        setTimeLeft(f * 60);
      } catch (err) {
        console.error("Error loading pomodoro settings:", err);
      }

      setLoading(false);
    };

    fetchSettings();
  }, [authToken]);

  // Save settings
  const saveSettings = async () => {
    try {
      await axios.put(
        `${backendUrl}/auth/pomodoro`,
        { focusMinutes: focus, breakMinutes: breakTime },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      alert("Settings saved!");

      // Instantly update timer (if not running)
      if (!running) {
        setTimeLeft(focus * 60);
      }
    } catch (err) {
      console.error("Error saving pomodoro settings:", err);
    }
  };

  // Handle Timer Logic
  useEffect(() => {
    if (!running) {
      // Stop interval
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Play sound 5 times
          let count = 0;
          const playLoop = () => {
            if (!soundRef.current) return;
            soundRef.current.play();
            count++;
            if (count < 5) setTimeout(playLoop, 300);
          };
          playLoop();

          // Send browser notification
          sendNotification(
            mode === "focus" ? "Break Time!" : "Back to Focus!"
          );

          // Switch mode
          const nextMode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);

          return nextMode === "focus" ? focus * 60 : breakTime * 60;
        }

        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalRef.current);
  }, [running, mode, focus, breakTime]);

  // When the user changes focus/break (but timer is NOT running), update instantly
  useEffect(() => {
    if (!running) {
      setTimeLeft(mode === "focus" ? focus * 60 : breakTime * 60);
    }
  }, [focus, breakTime, mode, running]);

  if (loading) return <p>Loading Pomodoro Settings...</p>;

  return (
    <div className="container mt-4">
      <h2>Pomodoro Timer</h2>

      <h3 className="mt-3">
        {mode === "focus" ? "Focus Time" : "Break Time"}
      </h3>

      <h1 style={{ fontSize: "4rem", margin: "20px 0" }}>
        {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </h1>

      <button
        className="btn btn-primary btn-lg"
        onClick={() => setRunning(!running)}
      >
        {running ? "Pause" : "Start"}
      </button>

      <hr />

      <h3>Customize Session</h3>

      <label className="mt-2">
        Focus (minutes):
        <input
          type="number"
          value={focus}
          onChange={(e) => setFocus(Number(e.target.value))}
          className="form-control"
        />
      </label>

      <label className="mt-2">
        Break (minutes):
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
          className="form-control"
        />
      </label>

      <button className="btn btn-success mt-3" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default Pomodoro;
