import React from 'react';
import { HiHome } from 'react-icons/hi';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto transition-colors duration-300">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="flex items-center justify-center md:justify-start gap-3 text-xl font-bold text-gray-900 dark:text-white mb-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm">
                                <HiHome className="w-4 h-4" />
                            </span>
                            <span>HouseFit</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your trusted housing management platform
                        </p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} HouseFit. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Built with React, Node.js & AI
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
