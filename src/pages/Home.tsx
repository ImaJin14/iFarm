import React from 'react';
import Hero from '../components/Homepage/Hero';
import FeaturedBreeds from '../components/Homepage/FeaturedBreeds';
import News from '../components/Homepage/News';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedBreeds />
      <News />
    </div>
  );
}