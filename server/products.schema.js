export const productSchema = {
  required: ["name", "price", "category", "brand", "stock", "rating", "description"],
  validate(p) {
    const missing = this.required.filter(k => !(k in p));
    if (missing.length) {
      return { ok: false, reason: `Missing: ${missing.join(", ")}` };
    }
    return { ok: true };
  }
};
