import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Leaf } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Premium Livestock
                <span className="text-green-600 block">Breeding Farm</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Sustainable farming practices meet exceptional breeding standards. 
                Discover quality rabbits, guinea pigs, dogs, cats, and fowls with a commitment to animal welfare.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">Award Winning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">Ethical Care</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">Sustainable</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 group"
              >
                View Our Animals
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-green-600 text-base font-medium rounded-lg text-green-600 bg-white hover:bg-green-50 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4588000/pexels-photo-4588000.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beautiful animals at iFarm"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              15+ Years Experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}