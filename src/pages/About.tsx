import React from 'react';
import { Award, Leaf, Heart, Users, MapPin, Calendar, Star } from 'lucide-react';
import { useTeam } from '../hooks/useTeam';
import { useAboutContent } from '../hooks/useAboutContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function About() {
  const { teamMembers, loading, error, refetch } = useTeam();
  const { aboutContent, loading: aboutLoading, error: aboutError } = useAboutContent();
  
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart, Leaf, Award, Users, Calendar, MapPin, Star
    };
    return icons[iconName] || Heart;
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      yellow: 'bg-yellow-100 text-yellow-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  if (aboutLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (aboutError || !aboutContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ErrorMessage message={aboutError || 'Failed to load about content'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About iFarm
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.hero_intro_text}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                {aboutContent.mission_statement}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {(aboutContent.values_list as any[])?.map((value, index) => {
                  const IconComponent = getIconComponent(value.icon);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{value.title}</h3>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4588012/pexels-photo-4588012.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Farm facilities"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Farm History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.history_intro_text}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(aboutContent.history_milestones as any[])?.map((milestone, index) => {
              const IconComponent = getIconComponent(milestone.icon);
              return (
                <div key={index} className="text-center">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.year}</h3>
                    <p className="text-gray-600">{milestone.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to excellence in multi-species breeding and care
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={refetch} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certifications & Awards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.certifications_intro_text}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(aboutContent.certifications_awards as any[])?.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getColorClasses(cert.color)}`}>
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Farm Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.gallery_intro_text}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {aboutContent.gallery_images?.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Farm gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}