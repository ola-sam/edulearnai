import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Testimonial } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { data: testimonials = [], isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials/featured']
  });

  // Auto-advance the testimonials every 7 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const goToNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const goToPrevious = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="bg-primary-50 p-8 rounded-xl max-w-3xl mx-auto animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="h-6 w-6 bg-primary-200 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-primary-200 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-primary-200 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-primary-200 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-primary-200 rounded-full mx-1"></div>
        </div>
        <div className="h-24 bg-primary-200 rounded mb-4"></div>
        <div className="h-6 w-32 bg-primary-200 rounded mx-auto"></div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    // Fallback to static content if there's an error
    return (
      <div className="bg-primary-50 p-8 rounded-xl max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="material-icons text-yellow-500">star</span>
          ))}
        </div>
        <p className="text-gray-700 italic mb-4">
          "JubunuAI has transformed how I teach my 5th-grade class. The personalized learning paths and analytics have helped me identify and address learning gaps more effectively than ever before."
        </p>
        <div>
          <p className="font-medium">Ms. Johnson</p>
          <p className="text-sm text-gray-600">Elementary School Teacher</p>
        </div>
      </div>
    );
  }
  
  const testimonial = testimonials[activeIndex] as Testimonial;
  
  return (
    <div className="relative">
      <Card className="bg-primary-50 p-8 rounded-xl max-w-3xl mx-auto relative">
        <div className="flex items-center justify-center mb-4">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <span key={i} className="material-icons text-yellow-500">star</span>
          ))}
        </div>
        <p className="text-gray-700 italic mb-4">
          "{testimonial.content}"
        </p>
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-sm text-gray-600">
            {testimonial.role}
            {testimonial.organization && ` • ${testimonial.organization}`}
          </p>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-primary-600' : 'bg-primary-200'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </Card>
      
      {/* Navigation buttons */}
      {testimonials.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-gray-200 shadow-md hover:bg-gray-100 z-10"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white border-gray-200 shadow-md hover:bg-gray-100 z-10"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TestimonialSlider;