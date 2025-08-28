'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DogImage {
  message: string;
  status: string;
}

export default function Home() {
  const [dogImages, setDogImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchDogImages = async () => {
      try {
        setLoading(true);
        const promises = Array.from({ length: 20 }, () =>
          fetch('https://dog.ceo/api/breeds/image/random')
            .then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        setDogImages(results);
      } catch (err) {
        setError('Failed to fetch dog images');
        console.error('Error fetching dog images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogImages();
  }, []);

  const saveFavorite = async (index: number, dog: DogImage) => {
    try {
      setSavingStates(prev => ({ ...prev, [index]: true }));
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: dog.message,
          breedName: null // We could extract breed from URL later
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite');
      }

      // Show success feedback
      const button = document.querySelector(`[data-dog-index="${index}"]`) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Saved!';
        button.disabled = true;
        button.className = 'px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          button.className = 'px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors';
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving favorite:', err);
      alert('Failed to save favorite dog. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching adorable dogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-16 px-8 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              MasterChef: Crowd-cooking with Cursor
            </h1>
            <p className="text-gray-600">
              🐕 Fetching 20 random dogs from the Dog API
            </p>
          </div>
          <Link 
            href="/favorites"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            ❤️ My Favorites
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {dogImages.map((dog, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Image 
                src={dog.message} 
                alt={`Random dog ${index + 1}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized
              />
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Dog #{index + 1}</p>
                  <button
                    data-dog-index={index}
                    onClick={() => saveFavorite(index, dog)}
                    disabled={savingStates[index]}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {savingStates[index] ? 'Saving...' : '❤️ Save'}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Status: {dog.status}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="https://dog.ceo/dog-api/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Dog API</a>
          </p>
        </div>
      </div>
    </div>
  );
} 