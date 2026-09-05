import { Router } from 'express';
import { LocationController } from './location.controller';

const router = Router();

router.get('/search', LocationController.searchLocation);

export const LocationRoutes = router;