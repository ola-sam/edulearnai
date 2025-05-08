import { useQuery } from '@tanstack/react-query';
import type { Statistic } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

const StatisticsGrid = () => {
  const { data: statistics = [], isLoading, error } = useQuery<Statistic[]>({
    queryKey: ['/api/statistics'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex flex-col items-center text-center animate-pulse">
            <div className="h-10 w-32 bg-primary-100 mb-2 rounded flex justify-center">
              <div className="h-6 w-6 bg-primary-200 rounded-full self-center mr-2"></div>
            </div>
            <div className="h-6 w-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if ((error || !statistics) && !isLoading) {
    // Fallback to static content if there's an error
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="p-4 flex flex-col items-center text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">school</span>
            10K+
          </div>
          <p className="text-gray-600">Active Students</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">groups</span>
            500+
          </div>
          <p className="text-gray-600">Dedicated Teachers</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">menu_book</span>
            1000+
          </div>
          <p className="text-gray-600">Interactive Lessons</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">star</span>
            95%
          </div>
          <p className="text-gray-600">Satisfaction Rate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      {statistics && statistics.length > 0 && statistics.map((stat: Statistic) => (
        <div key={stat.id} className="p-4 flex flex-col items-center text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            {stat.icon && <span className="material-icons mr-2 text-3xl">{stat.icon}</span>}
            {stat.value}
          </div>
          <p className="text-gray-600">{stat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default StatisticsGrid;