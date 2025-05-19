import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as eventController from '../controllers/eventController';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('ORGANIZER'));

//Semua controller async perlu catchAsync() saat dipasang di router.
//Supaya Express paham kalau Promise error akan dikirim ke next().
router.post('/', catchAsync(eventController.createEvent));
router.get('/', catchAsync(eventController.getMyEvents));
router.get('/:eventId', catchAsync(eventController.getEventDetail));
router.put('/:eventId', catchAsync(eventController.updateEvent));
router.delete('/:eventId', catchAsync(eventController.deleteEvent));
router.get('/:eventId/attendees', catchAsync(eventController.getEventAttendees));


export default router;
