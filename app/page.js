"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const res = await fetch("/api/arrivals");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []); if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-300 text-lg animate-pulse">
          Loading...
        </div>
      </div>
    );

  if (!Array.isArray(data) || data.length === 0)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-400 text-lg">
          No upcoming arrivals.
        </div>
      </div>
    );

  else return (
    <div className="flex flex-col space-y-4 mt-8 mx-2">
      {data.map((route, index) => {
        const isNow = route.minutesUntilArrival === 0;
        return (
          <div
            key={index}
            className="relative flex items-center bg-gray-900 rounded-xl p-4 w-full shadow-lg"
          >
            <div className="flex items-end space-x-2">
              <div className="text-white text-3xl font-bold">
                {isNow ? "NOW" : route.minutesUntilArrival}
              </div>
              {!isNow && <div className="text-white text-sm self-end mb-1">min</div>}
            </div>

            <div className="absolute left-[100px] right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex-shrink-0">
                {route.route}
              </div>

              <div className="text-white text-sm truncate">
                {route.routeDirection}
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={refresh}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white pr-8 pl-8 p-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 font-bold transition-colors">
        RELOAD
      </button>

    </div>
  );




}
