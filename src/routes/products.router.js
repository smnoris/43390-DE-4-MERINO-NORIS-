import { Router } from "express";
import ProductManager from "../managers/productsManager.js";
import { __dirname } from "../utils.js";

const manager = new ProductManager(__dirname + "/files/productos.json");
const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    const productos = await manager.getProductos();
    if (limit) {
        const limitedProductos = productos.slice(0, limit);
        res.status(200).json(limitedProductos);
    } else if (!limit) {
        res.status(200).json(productos);
    } else {
        res.status(400).json({ message: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const producto = await manager.getProductosById(id);
    if (producto === "Not Found") {
        res.status(400).json({ message: "Producto no encontrado" });
    } else if (producto) {
        res.status(200).json(producto);
    } else {
        res.status(400).json({ message: "Producto no encontrado" });
    }
});

router.post("/", async (req, res) => {
    try {
        const producto = await manager.addProducto(req.body);
        if (producto === "Codigo ingresado ya existente") {
            res.status(400).json({ message: "Error al crear el producto", producto });
        } else if (producto === "Complete all fields") {
            res.status(400).json({ message: "Error al crear el producto", producto });
        } else {
            res.status(201).json({ message: "Producto creado", producto });
        }
    } catch (error) {
        throw new error("Error al crear el producto", error);
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const producto = await manager.updateProducto(id, req.body);
    if (producto) {
        res.status(200).json({ message: "Producto actualizado", producto });
    } else {
        res.status(400).json({ message: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const producto = await manager.deleteProducto(id);
    if (producto === `No se encuentra el producto con id: ${id}`) {
        res.status(400).json({ message: "Error al eliminar el producto", producto });
    } else if (producto) {
        res.status(200).json({ message: "Producto eliminado", producto });
    } else {
        res.status(400).json({ message: "Error al eliminar el producto" });
    }
});

export default router;