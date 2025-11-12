import express from "express";
import { createOrUpdateShop, getMyShop, getShopByCity } from "../controller/shop.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";
const shopRouter=express.Router();
shopRouter.post("/shop",authMiddleware,multerMiddleware.single("image"),createOrUpdateShop)
shopRouter.post("/shop/:id",authMiddleware,multerMiddleware.single("image"),createOrUpdateShop)
shopRouter.get("/shop",authMiddleware,getMyShop)
shopRouter.get("/shop-by-city/:city",getShopByCity)

export default shopRouter;