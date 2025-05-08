export interface CreateEventDTO {
    title: string;
    description: string;
    date: string;
    totalSeats: number;
    location: string;

  }
  
  export interface UpdateEventDTO {
    title?: string;
    description?: string;
    date?: string;
    totalSeats?: number;
    location?: string;
  }
  