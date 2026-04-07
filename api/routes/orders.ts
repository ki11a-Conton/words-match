import { Router, Response } from 'express';
import prisma from '../db.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('获取订单列表错误:', error);
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('获取订单详情错误:', error);
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipientName, recipientPhone, address, city, postalCode, items } = req.body;

    if (!recipientName || !recipientPhone || !address || !city || !items || items.length === 0) {
      res.status(400).json({ error: '请填写完整的配送信息和订单商品' });
      return;
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        total,
        status: 'pending',
        recipientName,
        recipientPhone,
        address,
        city,
        postalCode: postalCode || '',
        items: {
          create: items.map((item: { 
            productId: string; 
            productName: string; 
            productImage: string;
            quantity: number; 
            price: number; 
            temperature: string; 
            sweetness: string; 
            size: string 
          }) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: item.price,
            temperature: item.temperature,
            sweetness: item.sweetness,
            size: item.size,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { userId: req.userId },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('创建订单错误:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

router.put('/:id/status', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: '无效的订单状态' });
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    console.error('更新订单状态错误:', error);
    res.status(500).json({ error: '更新订单状态失败' });
  }
});

router.get('/admin/all', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('获取所有订单错误:', error);
    res.status(500).json({ error: '获取所有订单失败' });
  }
});

export default router;
