// Middleware para validar datos de producto
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }
  if (price == null || isNaN(price)) {
    return res.status(400).json({ error: "El precio debe ser un número válido" });
  }
  if (price < 0) {
    return res.status(400).json({ error: "El precio no puede ser negativo" });
  }

  next(); // Si todo está bien, sigue al controlador
};

module.exports = validateProduct;