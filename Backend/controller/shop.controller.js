import Shop from "../models/shop.modal.js";
import uploadFileOnCloudinary from "../utils/cloudinary.js";

export const createOrUpdateShop = async (req, res) => {
  try {
    const { id } = req.params; // Check for ID (for update)
    const { name, city, state, address } = req.body;
    const owner = req.user?._id; // authMiddleware se

    if (id) {
      // --- UPDATE LOGIC ---

      // 1. Find shop
      const shop = await Shop.findById(id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found." });
      }

      // 2. Check ownership
      if (shop.owner.toString() !== owner.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized. You do not own this shop." });
      }

      // 3. Handle optional image update
      let imageUrl = shop.image; // Default mein purani image rakhein
      if (req.file) {
        // (Aap yahan purani image Cloudinary se delete karne ki logic add kar sakte hain)
        imageUrl = await uploadFileOnCloudinary(req.file.path);
        if (!imageUrl) {
          return res.status(500).json({ message: "Image update failed." });
        }
      }

      // 4. Fields update karein
      shop.name = name || shop.name;
      shop.city = city || shop.city;
      shop.state = state || shop.state;
      shop.address = address || shop.address;
      //   shop.item = item || shop.item;
      shop.image = imageUrl;

      const updatedShop = await shop.save();
      await updatedShop.populate("owner");
      return res
        .status(200)
        .json({ message: "Successfully updated", shop: updatedShop });
    } else {
      // --- CREATE LOGIC ---
      // (Yeh aapka original Canvas code hai)

      if (!name) {
        return res.status(400).json({ message: "Shop name is required." });
      }
      if (!city) {
        return res.status(400).json({ message: "City is required." });
      }
      if (!state) {
        return res.status(400).json({ message: "State is required." });
      }
      if (!address) {
        return res.status(400).json({ message: "Address is required." });
      }
      //   if (!item) {
      //     return res.status(400).json({ message: "Item (ID) is required." });
      //   }
      if (!owner) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Owner ID is missing." });
      }
      console.log(req.file);
      if (!req.file) {
        return res.status(400).json({ message: "Shop image is required." });
      }

      const image = await uploadFileOnCloudinary(req.file.path);
      if (!image) {
        return res.status(500).json({ message: "Image upload failed." });
      }

      const shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner,
      });

      await shop.populate("owner");
      res.status(201).json({ message: "shop create succfully", shop });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Shop create/update error", error: error.message });
  }
};
export const getMyShop = async (req, res) => {
  try {
    const checkData = await Shop.find();
    if (checkData.length === 0) {
      return res
        .status(200)
        .json({ message: "Your shop is empty", data: checkData });
    }
    const shop = await Shop.findOne({ owner: req.user._id }).populate(
      "owner item"
    );
    if (!shop) {
      return res.status(400).json({ message: "Shop not founded" });
    }
    res.status(200).json({ message: "Your shop data ", shop });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};
export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ message: "City parameter is required." });
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("owner", "-password");
    if (!shops || shops.length === 0) {
      return res
        .status(404)
        .json({ message: `No shops found in ${city}.`, shops: [] });
    }
    return res.status(200).json({
      message: `Successfully found ${shops.length} shops in ${city}.`,
      shops: shops,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};
