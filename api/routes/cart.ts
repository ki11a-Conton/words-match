import { Router, Response } from 'express';
import prisma from '../db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(cartItems);
  } catch (error) {
    console.error('获取购物车错误:', error);
    res.status(500).json({ error: '获取购物车失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity, temperature, sweetness, size } = req.body;

    if (!productId || !quantity) {
      res.status(400).json({ error: '请提供产品ID和数量' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: '产品不存在' });
      return;
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.userId,
        productId,
        temperature: temperature || 'cold',
        sweetness: sweetness || 'fifty',
        size: size || 'medium',
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: { product: true },
      });
      res.json(updatedItem);
      return;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.userId!,
        productId,
        quantity,
        temperature: temperature || 'cold',
        sweetness: sweetness || 'fifty',
        size: size || 'medium',
        price: product.price,
      },
      include: { product: true },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('添加购物车错误:', error);
    res.status(500).json({ error: '添加购物车失败' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ error: '数量必须大于0' });
      return;
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingItem) {
      res.status(404).json({ error: '购物车商品不存在' });
      return;
    }

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    res.json(cartItem);
  } catch (error) {
    console.error('更新购物车错误:', error);
    res.status(500).json({ error: '更新购物车失败' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingItem = await prisma.cartItem.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingItem) {
      res.status(404).json({ error: '购物车商品不存在' });
      return;
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({ message: '商品已从购物车移除' });
  } catch (error) {
    console.error('删除购物车商品错误:', error);
    res.status(500).json({ error: '删除购物车商品失败' });
  }
});

router.delete('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId },
    });

    res.json({ message: '购物车已清空' });
  } catch (error) {
    console.error('清空购物车错误:', error);
    res.status(500).json({ error: '清空购物车失败' });
  }
});

export default router;
