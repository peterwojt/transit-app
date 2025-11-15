import dotenv from 'dotenv';
dotenv.config();

import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const hours = now.getHours();
  var stop_id;
  var stop_id_2;

  if (hours<process.env.HOUR_1 || (!process.env.STOP_2?.trim() && !process.env.STOP_3?.trim())){
    stop_id = process.env.STOP_1;
  } else if (hours<process.env.HOUR_2 || !process.env.STOP_3?.trim()) {  
    stop_id = process.env.STOP_2;
  } else {
    stop_id = process.env.STOP_3;
    stop_id_2 = process.env.STOP_4;
  }
  const api_url= `https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/${stop_id}.json?key=${process.env.API_KEY}`;
  
  const res = await fetch(api_url);
  const data = await res.json();
  const response = [];

  data.data.entry.arrivalsAndDepartures.forEach(route => {
    const date = new Date(route.scheduledArrivalTime-data.currentTime);
    response.push({
        minutesUntilArrival: date.getMinutes(),
        route: route.routeShortName,
        routeDirection: route.tripHeadsign
    });
  });

  response.sort((a, b) => a.minutesUntilArrival - b.minutesUntilArrival);

  return NextResponse.json(response);
}