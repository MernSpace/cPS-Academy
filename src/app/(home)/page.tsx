"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Landing() {
  const features = [
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

  const [data, setData] = useState([])

  useEffect(() => {
    const featchData = async () => {
      let res = await fetch("http://localhost:1337/api/articles?populate=*")
      let jsonData = await res.json()
      setData(jsonData)
    }
    featchData()

  }, [])

  console.log(data)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-blue-400/50" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Future with
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {' '}Professional Learning
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join CPS Academy and unlock your potential with expert-led courses,
                hands-on projects, and a community of learners.
              </p>
              <div className="flex gap-4">
                <Link href="/auth">
                  <Button size="lg" className="text-lg px-8">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r  from-blue-600 to-blue-400 opacity-20 blur-3xl rounded-full" />
              <Image
                src={"/hero-image.jpg"}
                alt='Student'
                width={600}
                height={500}
                className="relative z-10 rounded-2xl shadow-2xl object-cover"
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
