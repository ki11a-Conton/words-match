import { Router, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

router.post('/create-checkout-session', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ error: '请提供订单ID' });
      return;
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.userId },
      include: {
        items: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }

    if (order.status !== 'pending') {
      res.status(400).json({ error: '订单状态不允许支付' });
      return;
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'cny',
        product_data: {
          name: `${item.productName} (${item.temperature}, ${item.sweetness}, ${item.size})`,
          images: item.productImage ? [item.productImage] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
        userId: req.userId!,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
      },
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('创建支付会话错误:', error);
    res.status(500).json({ error: '创建支付会话失败' });
  }
});

router.post('/webhook', async (req, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook签名验证失败:', err);
    res.status(400).send('Webhook Error');
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          stripePaymentId: session.payment_intent as string,
        },
      });
    }
  }

  res.json({ received: true });
});

router.get('/verify/:sessionId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId,
        userId: req.userId,
      },
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
    console.error('验证支付错误:', error);
    res.status(500).json({ error: '验证支付失败' });
  }
});

export default router;
