"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import FullScreenLoader from "@/components/loader";
import Image from "next/image";

interface Course {
    id: number;
    documentId: string;
    title: string;
    description: any[]; // Rich text from Strapi
    instructor?: string;
    duration?: string;
    level?: string;
    thumbnail?: {
        id: number;
        documentId: string;
        name: string;
        url: string;
        formats?: any;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export default function Courses() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Check authentication
    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            router.push("/auth");
        }
    }, [router]);

    // ✅ Fetch courses from Strapi
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                if (!jwt) {
                    router.push("/auth");
                    return;
                }

                const res = await fetch("http://localhost:1337/api/courses?populate=*", {
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.status === 403) {
                    toast.error("Access denied. Please check Strapi permissions.");
                    return;
                }

                if (res.status === 401) {
                    toast.error("Session expired. Please login again.");
                    localStorage.removeItem("jwt");
                    router.push("/auth");
                    return;
                }

                if (!res.ok) {
                    throw new Error(`Failed to fetch courses: ${res.status}`);
                }

                const data = await res.json();
                setCourses(data.data || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Unable to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [router]);

    // Helper function to extract plain text from rich text description
    const getDescriptionText = (description: any[]): string => {
        if (!description || !Array.isArray(description)) return "";

        return description
            .map((block) => {
                if (block.type === "paragraph" && block.children) {
                    return block.children.map((child: any) => child.text || "").join("");
                }
                return "";
            })
            .join(" ")
            .trim();
    };

    if (loading) {
        return (
            <FullScreenLoader title="Loading Courser" />
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Course Catalog</h1>
                    <p className="text-xl text-muted-foreground">
                        Explore our comprehensive learning programs
                    </p>
                </div>

                {courses.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <CardTitle>No Courses Available</CardTitle>
                            <CardDescription>Check back soon for new courses!</CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const thumbnailUrl = course.thumbnail?.url
                                ? `http://localhost:1337${course.thumbnail.url}`
                                : null;

                            const descriptionText = getDescriptionText(course.description);

                            return (
                                <Card
                                    key={course.id}
                                    className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full py-0 pb-6"
                                >
                                    {thumbnailUrl ? (
                                        <div className="h-48 overflow-hidden flex-shrink-0">
                                            <Image
                                                src={thumbnailUrl}
                                                alt={course.title}
                                                width={400}
                                                height={192}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                                            <p className="text-4xl font-bold text-muted-foreground">
                                                {course.title.charAt(0)}
                                            </p>
                                        </div>
                                    )}
                                    <CardHeader className="flex-shrink-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <CardTitle className="text-xl">{course.title}</CardTitle>
                                            {course.level && (
                                                <Badge variant="secondary">{course.level}</Badge>
                                            )}
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {descriptionText || "No description available"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto pt-0">
                                        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                                            {course.instructor && <span>By {course.instructor}</span>}
                                            {course.duration && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {course.duration} hours
                                                </div>
                                            )}
                                        </div>
                                        <Link href={`/courses/${course.documentId}`}>
                                            <Button className="w-full">View Course</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}