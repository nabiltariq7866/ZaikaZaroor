import Item from "../models/item.modal.js";
import Shop from "../models/shop.modal.js";
import uploadFileOnCloudinary from "../utils/cloudinary.js";
export const createItem = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    let image;
    const owner = req.user._id;
    if (!name) {
      return res.status(400).json({ message: "item name is required." });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required." });
    }
    if (!price) {
      return res.status(400).json({ message: "price is required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "item image is required." });
    }
    image = await uploadFileOnCloudinary(req.file.path);
    if (!image) {
      return res.status(400).json({ message: "item image is not uploaded." });
    }
    const shop = await Shop.findOne({ owner: owner });
    if (!shop) {
      return res.status(400).json({ message: "Shop is not founded." });
    }
    const item = await Item.create({
      name,
      image,
      category,
      shop: shop._id,
      price,
    });
    await item.populate("shop");
    res.status(201).json({ message: "item created successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;
    const ownerId = req.user?._id;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found for this owner." });
    }
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (item.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized. This item does not belong to your shop.",
      });
    }

    let image = item.image;
    if (req.file) {
      image = await uploadFileOnCloudinary(req.file.path);
      if (!image) {
        return res.status(400).json({ message: "Item image is not uploaded." });
      }
    }

    item.name = name || item.name;
    item.category = category || item.category;
    item.price = price || item.price;
    item.image = image;

    const updatedItem = await item.save();

    return res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Item update error",
      error: error.message,
    });
  }
};
export const getMyItems = async (req, res) => {
  try {
    const ownerId = req.user?._id;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found for this owner." });
    }
    const items = await Item.find({ shop: shop._id }).populate("shop");
    return res.status(200).json({
      message: "Items successfully received",
      items: items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteItem = async (req, res) => {
  try {
    const {id }= req.params;
    const ownerId = req.user._id;
    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found for this owner." });
    }
    const item =await Item.findById(id);
    
    if (item.shop.toString() !== shop._id.toString()) {
      return res
        .status(403)
        .json({
          message: "Unauthorized. This item does not belong to your shop.",
        });
    }
    await Item.findByIdAndDelete(id)
     return res.status(200).json({
      message: "Item deleted successfully",
    });
     
  } catch (error) {
     return res.status(500).json({
      message: "Item delete error",
      error: error.message,
    });
  }
};
