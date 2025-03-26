
import { db } from '../../db/index.js';
import { productsTable } from '../../db/productsSchema.js';
import { eq } from 'drizzle-orm';
import _ from 'lodash';

export async function listProducts(req, res) {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)));

    if (!product) {
      res.status(404).send({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function createProduct(req, res) {
  try {
    console.log(req.userId);

    const [product] = await db
      .insert(productsTable)
      .values(req.cleanBody)
      .returning();
    res.status(201).json(product);
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.cleanBody;

    const [product] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ message: 'modification failed' });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Product was not found' });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function likeProduct(req, res) {
  try {
    const { id } = req.params;
    const [product] = await db
      .update(productsTable)
      .set({ liked: true })
      .where(eq(productsTable.id, Number(id)))
      .returning();
    res.json(product);
  } catch (e) {
    res.status(500).send(e);
  }
}