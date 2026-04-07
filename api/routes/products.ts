import { Router, Response } from 'express';
import prisma from '../db.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    const where = category ? { category: category as string } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('获取产品列表错误:', error);
    res.status(500).json({ error: '获取产品列表失败' });
  }
});

router.get('/:id', async (req, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: '产品不存在' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('获取产品详情错误:', error);
    res.status(500).json({ error: '获取产品详情失败' });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, image, temperature, sweetness, size } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400).json({ error: '请填写所有必填字段' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || '',
        temperature: temperature || 'cold,hot',
        sweetness: sweetness || 'full,seventy,fifty,thirty,none',
        size: size || 'medium,large,extra_large',
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('创建产品错误:', error);
    res.status(500).json({ error: '创建产品失败' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, temperature, sweetness, size } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ error: '产品不存在' });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        category: category || existingProduct.category,
        image: image !== undefined ? image : existingProduct.image,
        temperature: temperature || existingProduct.temperature,
        sweetness: sweetness || existingProduct.sweetness,
        size: size || existingProduct.size,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('更新产品错误:', error);
    res.status(500).json({ error: '更新产品失败' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ error: '产品不存在' });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: '产品已删除' });
  } catch (error) {
    console.error('删除产品错误:', error);
    res.status(500).json({ error: '删除产品失败' });
  }
});

export default router;
