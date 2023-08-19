import { Router } from "express";
import ProductManager from "../managers/productsManager.js";
import { __dirname } from "../utils.js";

const pmanager = new ProductManager(__dirname + "/files/productos.json");
const router = Router();

router.get("/", async (req, res) => {
  const listaProductos = await pmanager.getProductos();
  res.render("home", { listaProductos });
});

router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await pmanager.getProducts();
  res.render("realTimeProducts", { listaProductos });
});

export default router;