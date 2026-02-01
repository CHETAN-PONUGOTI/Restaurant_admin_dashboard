import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <div className="flex flex-col items-center justify-center p-12 w-full">
    <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
    <p className="text-sm text-gray-500 font-medium">Fetching data...</p>
  </div>
);