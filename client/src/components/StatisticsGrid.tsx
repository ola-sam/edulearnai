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
      <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto mb-12">
        <div className="p-4 flex flex-col items-center text-center flex-1 min-w-[150px]">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">school</span>
            10K+
          </div>
          <p className="text-gray-600">Active Students</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center flex-1 min-w-[150px]">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">chalkboard_teacher</span>
            500+
          </div>
          <p className="text-gray-600">Dedicated Teachers</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center flex-1 min-w-[150px]">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">menu_book</span>
            1000+
          </div>
          <p className="text-gray-600">Interactive Lessons</p>
        </div>
        <div className="p-4 flex flex-col items-center text-center flex-1 min-w-[150px]">
          <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
            <span className="material-icons mr-2 text-3xl">star</span>
            95%
          </div>
          <p className="text-gray-600">Satisfaction Rate</p>
        </div>
      </div>
    );
  }

  // Create a manually ordered array with the specific expected sequence
  const orderedItems = [
    {id: 'active-students', name: 'Active Students', value: '10K+', icon: 'school'},
    {id: 'teachers', name: 'Dedicated Teachers', value: '500+', icon: 'chalkboard_teacher'},
    {id: 'lessons', name: 'Interactive Lessons', value: '1000+', icon: 'menu_book'},
    {id: 'satisfaction', name: 'Satisfaction Rate', value: '95%', icon: 'star'},
  ];

  return (
    <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto mb-12">
      {!isLoading && !error && statistics && statistics.length > 0 ? (
        // Map items in explicit predefined order
        orderedItems.map((item) => {
          // Find the corresponding statistic in our database
          const matchingStat = statistics.find(
            stat => stat.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
          );
          
          return (
            <div key={item.id} className="p-4 flex flex-col items-center text-center flex-1 min-w-[150px]">
              <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
                <span className="material-icons mr-2 text-3xl">{item.icon}</span>
                {matchingStat ? matchingStat.value : item.value}
              </div>
              <p className="text-gray-600">{item.name}</p>
            </div>
          );
        })
      ) : null}
    </div>
  );
};

export default StatisticsGrid;