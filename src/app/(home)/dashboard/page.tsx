"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Code, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔐 Fetch user info from Strapi
    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            router.push('/auth');
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:1337/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Unauthorized');
                }

                const data = await res.json();
                setUser(data);
            } catch (error) {
                toast.error('Please login again');
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');
                router.push('/auth');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // 🧭 Role-based content
    const getRoleContent = () => {
        switch (user.role?.name) {
            case 'student':
                return {
                    title: 'Student Dashboard',
                    description: 'Access your enrolled courses and track your learning progress',
                    features: [
                        { icon: BookOpen, title: 'My Courses', description: 'Continue where you left off', link: '/courses' },
                        { icon: TrendingUp, title: 'Progress', description: 'Track your achievements' },
                    ],
                };
            case 'developer':
                return {
                    title: 'Developer Dashboard',
                    description: 'Full access to all courses, modules, and administrative features',
                    features: [
                        { icon: Code, title: 'All Courses', description: 'Full course access', link: '/courses' },
                        { icon: BookOpen, title: 'Course Management', description: 'View and manage content' },
                        { icon: Users, title: 'User Analytics', description: 'Monitor user progress' },
                    ],
                };
            case 'social_media_manager':
                return {
                    title: 'Social Media Manager Dashboard',
                    description: 'Access marketing materials and course overviews',
                    features: [
                        { icon: TrendingUp, title: 'Course Catalog', description: 'Browse available courses', link: '/courses' },
                        { icon: Users, title: 'Engagement', description: 'Track course popularity' },
                    ],
                };
            default:
                return {
                    title: 'User Dashboard',
                    description: 'Explore available courses and upgrade to student access',
                    features: [
                        { icon: BookOpen, title: 'Course Catalog', description: 'Browse available courses', link: '/courses' },
                        { icon: Lock, title: 'Upgrade', description: 'Unlock student features' },
                    ],
                };
        }
    };

    const content = getRoleContent();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Welcome back, {user.username || 'User'}!
                            </h1>
                            <p className="text-xl text-muted-foreground">{content.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm px-4 py-2">
                            {user.role?.name?.replace('_', ' ').toUpperCase() || 'USER'}
                        </Badge>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {content.features.map((feature, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <feature.icon className="h-10 w-10 text-primary mb-4" />
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            {feature.link && (
                                <CardContent>
                                    <Link href={feature.link}>
                                        <Button className="w-full">View</Button>
                                    </Link>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>

                {(user.role?.name === 'student' || user.role?.name === 'developer') && (
                    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Ready to Learn?</CardTitle>
                            <CardDescription className="text-base">
                                Browse our course catalog and start your learning journey today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/courses">
                                <Button size="lg">Browse Courses</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
