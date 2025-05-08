import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Testimonial } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';
import useEmblaCarousel from 'embla-carousel-react';

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    dragFree: false
  });

  const { data: testimonials = [], isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials/featured'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', onSelect);
    
    // Set up auto-scroll
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 7000);
    
    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, onSelect]);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  if ((error || !testimonials || testimonials.length === 0) && !isLoading) {
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
  
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={testimonial.id}>
              <Card className="bg-primary-50 p-8 rounded-xl mx-4 h-full">
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
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary-600' : 'bg-primary-200'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation buttons */}
      {testimonials.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-gray-200 shadow-md hover:bg-gray-100 z-10"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white border-gray-200 shadow-md hover:bg-gray-100 z-10"
            onClick={scrollNext}
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