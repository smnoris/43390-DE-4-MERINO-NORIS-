import fs from "fs";


export default class ProductManager {
  constructor(path) {
    this.path = path;
  }


  addProducto = async (producto) => {
    try {
      const productos = await this.getProductos();
      const {
        title,
        description,
        price,
        thumbnail = [],
        category,
        status = true,
        code,
        stock,
      } = producto;

      const codeRepeat = productos.find((p) => p.code === producto.code);

      if (
        !producto.title ||
        !producto.description ||
        !producto.price ||
        !producto.thumbnail ||
        !producto.category ||
        !producto.status ||
        !producto.code ||
        !producto.stock
      ) {
        return "Complete todos los campos";
      }
      if (codeRepeat) {
        return "Codigo ingresado ya existente";
      }
      let id;
      if (productos.length === 0) {
        id = 1;
      } else {
        id = productos[productos.length - 1].id + 1;
      }

      productos.push({ ...producto, id });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
      return producto;
    } catch (error) {
      console.log(error);
    }
  };

  getProductos = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const parseData = JSON.parse(data);
        return parseData;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProductosById = async (id) => {
    try {
      let results = await this.getProductos();
      let producto = results.find((p) => p.id === id);

      if (producto) {
        return producto;
      } else {
        return "Not Found";
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateProducto = async (id, updatedProducto) => {
    try {
      const productos = await this.getProductos();
      const indexOfProducto = productos.findIndex((p) => p.id === id);
      if (indexOfProducto === -1) {
        return `No se encuentra el producto : ${id}`;
      }

      productos[indexOfProducto] = {
        ...productos[indexOfProducto],
        ...updatedProducto,
      };

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
      return productos[indexOfProducto];
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const productos = await this.getProductos();
      const index = productos.findIndex((p) => p.id === parseInt(id));

      if (index < 0) {
        return `No se encuentra producto con: ${id}`;
      }
      productos.splice(index, 1);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );

      return productos;
    } catch (error) {
      console.log(error);
    }
  };
}