"use client"
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/supabase';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
    const { user, profile } = useAuth();
    const navigate = useRouter();

    const handleLogout = async () => {
        const { error } = await authService.signOut();
        if (error) {
            toast.error('Error logging out');
        } else {
            toast.success('Logged out successfully');
            navigate.push('/')
        }
    };

    return (
        <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <span className="bg-gradient-to-r  from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            CPS Academy
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                                <Link href="/courses">
                                    <Button variant="ghost">Courses</Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <User className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col">
                                                <span>{profile?.full_name || 'User'}</span>
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    {profile?.role?.replace('_', ' ') || 'user'}
                                                </span>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/auth">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
