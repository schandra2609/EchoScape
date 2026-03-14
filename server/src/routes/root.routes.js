/**
 * @file root.routes.js
 * @module Routes/Root
 * @description Central routing handler for the API.
 * Aggregates all domain-specific routers and mounts them under the base API path.
 * @author Sayan Chandra
 */
import { Router } from "express";
import journalRoutes from "./journal.routes.js";

const router = Router();

/**
 * @description Mount the journal routing module.
 * All routes inside journalRoutes will now be prefixed with /journal
 */
router.use("/journal", journalRoutes);

export default router;