import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";
import { createItem, deleteItem, getItemsByCity, getMyItems, updateItem } from "../controller/item.controller.js";
const itemRouter=express.Router();
itemRouter.post("/item",authMiddleware,multerMiddleware.single("image"),createItem)
itemRouter.post("/item/:id",authMiddleware,multerMiddleware.single("image"),updateItem)
itemRouter.get("/item",authMiddleware,getMyItems) 
itemRouter.delete("/item/:id",authMiddleware,deleteItem) 
itemRouter.get("/item-by-city/:city",getItemsByCity)
export default itemRouter;