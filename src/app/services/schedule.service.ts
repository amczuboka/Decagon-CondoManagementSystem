import { Injectable } from '@angular/core';
import { EventColor } from 'calendar-utils';

export const colors: Record<string, EventColor> = {
  Spa: {
    primary: '#33010e',
    secondary: '#800020',
    secondaryText: '#e4a5b5',
  },

  Pool: {
    primary: '#72ffde',
    secondary: '#87CEEB',
    secondaryText: '#e4f7ff',
  },

  Playground: {
    primary: '#0bf107',
    secondary: '#ede20f',
    secondaryText: '#d30af7',
  },

  MeetingRoom: {
    primary: '#9a9797',
    secondary: '#000000',
    secondaryText: '#ffffff',
  },

  Gym: {
    primary: '#e9e9d0',
    secondary: '#d55200',
    secondaryText: '#e9e9d0',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor() {}
  
}
