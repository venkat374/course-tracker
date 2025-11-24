import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopNavLayout from "@/components/layout/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------
// Types
// ----------------------------
interface CourseResponse {
  courseName: string;
  platform: string;
  status: "Ongoing" | "Completed" | "Planned";
  instructor: string | null;
  completionDate: string | null;
  certificateLink: string | null;
  progress: number;
  notes: string | null;
}

const EditCourse: React.FC = () => {
  const { authToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form fields
  const [courseName, setCourseName] = useState<string>("");
  const [platform, setPlatform] = useState<string>("Other");
  const [status, setStatus] = useState<"Ongoing" | "Completed" | "Planned">("Ongoing");
  const [instructor, setInstructor] = useState<string>("");
  const [completionDate, setCompletionDate] = useState<string>("");
  const [certificateLink, setCertificateLink] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  // UI state
  const [message, setMessage] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch course details
  useEffect(() => {
    if (!authToken || !id) return;

    axios
      .get<CourseResponse>(`${backendUrl}/courses/${id}`, {
        headers: { "x-auth-token": authToken },
      })
      .then((res) => {
        const course = res.data;
        setCourseName(course.courseName ?? "");
        setPlatform(course.platform ?? "Other");
        setStatus(course.status ?? "Ongoing");
        setInstructor(course.instructor ?? "");
        setCompletionDate(
          course.completionDate
            ? new Date(course.completionDate).toISOString().split("T")[0]
            : ""
        );
        setCertificateLink(course.certificateLink ?? "");
        setProgress(course.progress ?? 0);
        setNotes(course.notes ?? "");
        setLoading(false);
      })
      .catch((err: AxiosError<any>) => {
        console.error("Error fetching course for edit:", err);
        setEditError(
          err.response?.data?.message || "Failed to load course details."
        );
        setLoading(false);
      });
  }, [id, authToken]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setEditError("");
    setIsSaving(true);

    if (!courseName.trim()) {
      setEditError("Course Name is required.");
      setIsSaving(false);
      return;
    }

    if (progress < 0 || progress > 100) {
      setEditError("Progress must be between 0 and 100.");
      setIsSaving(false);
      return;
    }

    const updatedCourse = {
      courseName,
      platform,
      status,
      instructor: instructor.trim() || null,
      completionDate: completionDate || null,
      certificateLink: certificateLink.trim() || null,
      progress: Number(progress),
      notes: notes.trim() || null,
    };

    try {
      const res = await axios.patch(
        `${backendUrl}/courses/${id}`,
        updatedCourse,
        {
          headers: { "x-auth-token": authToken },
        }
      );

      setMessage(res.data.message || "Course updated successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      console.error("Error updating course:", err);
      setEditError(
        err.response?.data?.message ||
        "Failed to update course. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <TopNavLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </TopNavLayout>
    );
  }

  return (
    <TopNavLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Course</CardTitle>
            <CardDescription>
              Update your course details and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {message && (
                <div className="bg-green-500/15 text-green-600 text-sm p-3 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </div>
              )}
              {editError && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Label htmlFor="courseName">Course Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                    )}
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="YouTube">YouTube</option>
                    <option value="freeCodeCamp">freeCodeCamp</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="LBRY">LBRY</option>
                    <option value="Skillshare">Skillshare</option>
                    <option value="CS50">CS50</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                    )}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="progress">Progress ({progress}%)</Label>
                  <div className="flex items-center gap-4 mt-1.5">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="certificateLink">Certificate Link</Label>
                  <Input
                    id="certificateLink"
                    type="url"
                    value={certificateLink}
                    onChange={(e) => setCertificateLink(e.target.value)}
                    placeholder="https://..."
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TopNavLayout>
  );
};

export default EditCourse;
