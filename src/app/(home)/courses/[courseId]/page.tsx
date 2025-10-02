'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

interface Module {
    id: number;
    title: string;
    duration: string;
    video?: {
        url: string;
    };
}

interface Course {
    id: number;
    documentId: string;
    title: string;
    description: any[];
    instructor: string;
    level: string;
    duration: string;
    thumbnail?: {
        url: string;
    };
    modules?: Module[];
}

interface PageProps {
    params: {
        courseId: string;
    };
}

const Page = ({ params }: PageProps) => {
    const { courseId } = params;
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [expandedModule, setExpandedModule] = useState<number | null>(null);

    // ✅ Check authentication
    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            router.push("/auth");
        }
    }, [router]);

    // ✅ Fetch course with modules from Strapi
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                if (!jwt) {
                    router.push("/auth");
                    return;
                }

                const res = await fetch(
                    `http://localhost:1337/api/courses/${courseId}?populate[thumbnail][fields][0]=url&populate[modules][populate][video][fields][0]=url`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) {
                    if (res.status === 401) {
                        toast.error("Session expired. Please login again.");
                        localStorage.removeItem("jwt");
                        router.push("/auth");
                        return;
                    }
                    if (res.status === 403) {
                        toast.error("Access denied. Check Strapi permissions.");
                        return;
                    }
                    throw new Error(`Failed to fetch course: ${res.status}`);
                }

                const data = await res.json();
                setCourse(data.data);
            } catch (error) {
                console.error("Error fetching course:", error);
                toast.error("Unable to load course");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, router]);

    const handleVideoClick = (videoUrl: string, moduleId: number) => {
        setActiveVideo(videoUrl);
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
    if (!course) return <div className="p-4 text-red-500">Course not found</div>;

    const { title, instructor, duration, level, description, thumbnail, modules } = course;

    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Video Player / Course Details */}
            <div className="lg:col-span-2">
                {/* Video Player or Thumbnail */}
                {activeVideo ? (
                    <div className="mb-4">
                        <video
                            key={activeVideo}
                            src={`http://localhost:1337${activeVideo}`}
                            controls
                            autoPlay
                            className="w-full rounded-xl shadow-lg"
                        />
                    </div>
                ) : thumbnail?.url ? (
                    <img
                        src={`http://localhost:1337${thumbnail.url}`}
                        alt={title}
                        className="w-full rounded-xl mb-4 shadow"
                    />
                ) : (
                    <div className="w-full h-96 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                        <p className="text-gray-500">No preview available</p>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-2">{title}</h1>

                <div className="text-gray-600 mb-4">
                    <p><strong>Instructor:</strong> {instructor}</p>
                    <p><strong>Level:</strong> {level}</p>
                    <p><strong>Duration:</strong> {duration} hours</p>
                </div>

                <div className="prose prose-gray">
                    {description?.map((block, index) => (
                        <p key={index}>
                            {block.children?.map((child: any) => child.text || "").join(" ")}
                        </p>
                    ))}
                </div>
            </div>

            {/* Right: Course Modules Accordion */}
            <div className="bg-gray-50 rounded-xl shadow p-5 lg:sticky lg:top-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">📚 Course Modules</h2>

                {modules && modules.length > 0 ? (
                    <div className="space-y-2">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className="bg-white rounded-lg border overflow-hidden"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-gray-800">{module.title}</p>
                                        <p className="text-sm text-gray-500">⏱ {module.duration}</p>
                                    </div>
                                    {expandedModule === module.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                {/* Accordion Content */}
                                {expandedModule === module.id && module.video?.url && (
                                    <div className="p-3 border-t bg-gray-50">
                                        <button
                                            onClick={() => handleVideoClick(module.video!.url, module.id)}
                                            className="w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Play className="w-5 h-5" />
                                            <span className="font-medium">Play Video</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No modules added yet.</p>
                )}
            </div>
        </div>
    );
};

export default Page;