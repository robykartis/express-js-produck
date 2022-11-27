import Product from "../model/ProductModel.js";
import User from "../model/UserModel.js";
import { Op } from "sequelize";

export const getProduct = async (req, res) => {
  try {
    let response;

    if (req.role === "admin") {
      // Jika sebagai admin makan bisa melihat seluruh product
      response = await Product.findAll({
        // Menampilkan data yang mau ditampilkan
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            // Menampilkan data user yang di imput
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      // Jika sebagai user biasa hanya bisa melihat data yang di input oleh user
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    // cek Id yang dikirimkan oleh user
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika tidak terdapat data yang dikirimkan user maka
    if (!product) return res.status(404).json({ msg: "Data Tidak Ditemukan" });
    let response;

    if (req.role === "admin") {
      // Jika sebagai admin makan bisa melihat seluruh product
      response = await Product.findOne({
        // Menampilkan data yang mau ditampilkan
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            // Menampilkan data user yang di imput
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      // Jika sebagai user biasa hanya bisa melihat data yang di input oleh user
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Produk berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    // cek Id yang dikirimkan oleh user
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika tidak terdapat data yang dikirimkan user maka
    if (!product) return res.status(404).json({ msg: "Data Tidak Ditemukan" });

    const { name, price } = req.body;

    if (req.role === "admin") {
      // Jika sebagai admin makan bisa melihat seluruh product
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses Terlarang" });
      // Jika sebagai user biasa hanya bisa melihat data yang di input oleh user
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Produk Berhasil Upadate" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    // cek Id yang dikirimkan oleh user
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika tidak terdapat data yang dikirimkan user maka
    if (!product) return res.status(404).json({ msg: "Data Tidak Ditemukan" });

    const { name, price } = req.body;

    if (req.role === "admin") {
      // Jika sebagai admin makan bisa melihat seluruh product
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses Terlarang" });
      // Jika sebagai user biasa hanya bisa melihat data yang di input oleh user
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Produk Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
