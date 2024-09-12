import { adminRoute, protectedRoute } from "../middleware/auth.middleware";
import express from express;
import { getAnalyticsData } from "../controllers/analytics.controller";


const router = express.Router();


router.get("/",protectedRoute,adminRoute,getAnalyticsData)




export default router;
