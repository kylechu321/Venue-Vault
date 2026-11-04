import { Router } from "express";
import { VenueHirerStatsController } from "@/controller/venueHirerStatsController";

const router = Router();
const venueHirerStatsController = new VenueHirerStatsController();

router.get("/venueHirerStats",
    (req, res) =>
        venueHirerStatsController.getHirerStats(req, res));

router.get("/venueHirerStats/charts",
    (req, res) =>
        venueHirerStatsController.getHirerChartStats(req, res));

router.get("/venueHirerStats/:hirerId/ratings",
    (req, res) =>
        venueHirerStatsController.getHirerRatings(req, res));
    


export default router;