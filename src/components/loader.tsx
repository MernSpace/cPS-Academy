import React from 'react';

interface FullScreenLoaderProps {
    title?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ title = "Loading" }) => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
            <div className="text-center">
                {/* Animated Spinner */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>

                    {/* Spinning Ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                    {/* Inner Pulsing Circle */}
                    <div className="absolute inset-3 bg-blue-600 rounded-full animate-pulse opacity-20"></div>

                    {/* Center Dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600">Please wait while we prepare your content...</p>

                {/* Animated Dots */}
                <div className="flex justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenLoader;