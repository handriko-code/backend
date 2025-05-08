import { Request, Response } from 'express';
import { createEventSchema, updateEventSchema } from '../schemas-zod/eventSchema';
import * as eventService from '../services/eventService';
import { ZodError } from 'zod';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }

  export const createEvent = async (req: Request, res: Response) => {
    try {
      console.log('Received body:', req.body);
      const data = createEventSchema.parse(req.body);
      const organizerId = (req as any).user.id;
  
      const event = await eventService.createEvent(organizerId, {
        ...data,
        availableSeats: data.totalSeats // secara otomatis terisi
      });
  
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Zod validation error:', error.flatten()); // log error detail ke console
        return res.status(400).json({ message: 'Validation failed', errors: error.flatten() });
      }
    
      console.error('Unexpected error:', error);
      return res.status(400).json({ message: getErrorMessage(error) });
    }
  };

export const getMyEvents = async (req: Request, res: Response) => {
  try {
    const organizerId = (req as any).user.id;
    const events = await eventService.getEventsByOrganizer(organizerId);
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const getEventDetail = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const organizerId = (req as any).user.id;
    const event = await eventService.getEventById(organizerId, eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const data = updateEventSchema.parse(req.body);
    const { eventId } = req.params;
    const organizerId = (req as any).user.id;
    const event = await eventService.updateEvent(organizerId, eventId, data);
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const organizerId = (req as any).user.id;
    const event = await eventService.deleteEvent(organizerId, eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};
