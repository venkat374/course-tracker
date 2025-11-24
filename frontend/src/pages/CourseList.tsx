import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopNavLayout from "@/components/layout/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Calendar, User, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

// ----------------------------
// Types
// ----------------------------
interface Course {
  _id: string;
  courseName: string;
  status: "Ongoing" | "Completed" | "Planned";
  instructor?: string;
  completionDate?: string;
  certificateLink?: string;
  progress?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CourseList: React.FC = () => {
  const { authToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCourses = async () => {
    if (!authToken) return;
    try {
      const res = await axios.get<Course[]>(`${backendUrl}/courses`, {
        headers: { "x-auth-token": authToken },
      });
      setCourses(res.data);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setErrorMsg("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [authToken]);

  const deleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setDeleteLoading(id);

    try {
      await axios.delete(`${backendUrl}/courses/${id}`, {
        headers: { "x-auth-token": authToken },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Ongoing":
        return "info";
      case "Planned":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <TopNavLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your learning progress
          </p>
        </div>
        <Button asChild>
          <Link to="/add-course">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>

      {errorMsg && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px] animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium text-foreground">No courses found</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Start by adding your first course to track.
          </p>
          <Button asChild variant="outline">
            <Link to="/add-course">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-xl line-clamp-2" title={course.courseName}>
                    {course.courseName}
                  </CardTitle>
                  <Badge variant={getStatusVariant(course.status) as any}>
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pb-3">
                {course.instructor && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    {course.instructor}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                </div>

                {course.completionDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(course.completionDate).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/20 flex justify-between">
                {course.certificateLink ? (
                  <Button variant="ghost" size="sm" asChild className="text-xs h-8">
                    <a href={course.certificateLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Certificate
                    </a>
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link to={`/edit-course/${course._id}`}>
                      <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteCourse(course._id)}
                    disabled={deleteLoading === course._id}
                  >
                    {deleteLoading === course._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </TopNavLayout>
  );
};

export default CourseList;
