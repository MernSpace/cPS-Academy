"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ✅ Define proper TypeScript interfaces
interface DescriptionChild {
  text: string;
  [key: string]: unknown; // Allow for other properties that might exist
}

interface DescriptionBlock {
  type: string;
  children: DescriptionChild[];
  [key: string]: unknown; // Allow for other properties that might exist
}

interface ThumbnailFormats {
  thumbnail?: {
    url: string;
  };
  small?: {
    url: string;
  };
  medium?: {
    url: string;
  };
  large?: {
    url: string;
  };
  [key: string]: unknown; // Allow for other format sizes
}

interface Thumbnail {
  id: number;
  documentId: string;
  name: string;
  url: string;
  formats?: ThumbnailFormats;
}

interface Course {
  id: number;
  documentId: string;
  title: string;
  description: DescriptionBlock[]; // Rich text from Strapi with proper typing
  instructor?: string;
  duration?: string;
  level?: string;
  thumbnail?: Thumbnail;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function Landing() {
  const features: Feature[] = [
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access structured learning paths with modules and detailed class content',
    },
    {
      icon: Users,
      title: 'Role-Based Learning',
      description: 'Personalized experience based on your role and learning objectives',
    },
    {
      icon: Award,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey and celebrate achievements',
    },
  ];

  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  // ✅ Fetch courses from Strapi
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/courses?populate=*`, {
          headers: {
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
      }
    };

    fetchCourses();
  }, [router]);

  const getThumbnailUrl = (url?: string) => {
    if (!url) return null;
    // If it's already a full URL, return it directly
    if (url.startsWith("http")) return url;
    // Otherwise, prepend the Strapi backend URL
    return `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "")}${url}`;
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-blue-400/50" />

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* Left Text Content */}
            <div className="space-y-5 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Future with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Professional Learning
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Join CPS Academy and unlock your potential with expert-led courses,
                hands-on projects, and a community of learners.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/auth">
                  <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-3xl rounded-full" />
              <Image
                src="/hero-image.jpg"
                alt="Student"
                width={700}  // Increased from 600
                height={550}
                className="relative z-10 rounded-2xl shadow-2xl object-cover w-full sm:w-[500px] md:w-[600px] lg:w-[700px] h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose CPS Academy?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-blue-500 transition-colors hover:shadow-blue-500 shadow-sm hover:shadow-md">
                <CardHeader>
                  <feature.icon className="h-12 w-12  text-blue-600  mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Courses */}
      <Separator />

      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>
              CPS Populer Courses
            </h2>
            <p className=' text-xl text-muted-foreground max-w-2xl mx-auto'>
              Join thousands of learners already transforming their careers
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {courses.map((items) => {
              const thumbnailUrl = getThumbnailUrl(items.thumbnail?.url);
              return (
                <Card
                  key={items.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full py-0 pb-6"
                >
                  {thumbnailUrl ? (
                    <div className="h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={thumbnailUrl}
                        alt={items.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <p className="text-4xl font-bold text-muted-foreground">
                        {items.title.charAt(0)}
                      </p>
                    </div>
                  )}
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{items.title}</CardTitle>
                      {items.level && <Badge variant="secondary">{items.level}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      {items.instructor && <span>By {items.instructor}</span>}
                      {items.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {items.duration} hours
                        </div>
                      )}
                    </div>
                    <Link href={`/courses/${items.documentId}`}>
                      <Button className="w-full">View Course</Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r  from-blue-600 to-blue-400 text-primary-foreground">
            <CardHeader className="text-center py-12">
              <CardTitle className="text-4xl mb-4">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg mb-6">
                Join thousands of learners already transforming their careers
              </CardDescription>
              <Link href="/auth" className="inline-block">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 CPS Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}