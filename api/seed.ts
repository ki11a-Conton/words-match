import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const products = [
  {
    name: '芝士莓莓',
    description: '新鲜草莓搭配香浓芝士奶盖，每一口都是夏日的甜蜜',
    price: 29,
    category: 'fruit_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20strawberry%20cheese%20tea%20in%20clear%20glass%20cup%2C%20pink%20strawberry%20pieces%20visible%2C%20white%20cheese%20foam%20on%20top%2C%20professional%20product%20photography%2C%20soft%20lighting%2C%20minimalist%20background%2C%20high%20end%20beverage%20photography&image_size=square',
    temperature: 'cold',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '芝士芒芒',
    description: '当季芒果与芝士奶盖的完美融合，热带风情尽在杯中',
    price: 29,
    category: 'fruit_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango%20cheese%20tea%20in%20elegant%20glass%20cup%2C%20golden%20yellow%20mango%20pulp%20visible%2C%20creamy%20white%20cheese%20foam%20top%2C%20professional%20product%20photography%2C%20soft%20natural%20lighting%2C%20minimalist%20aesthetic%2C%20premium%20beverage&image_size=square',
    temperature: 'cold',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '多肉葡萄',
    description: '阳光玫瑰葡萄，果肉饱满，每一颗都是自然的馈赠',
    price: 32,
    category: 'fruit_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20grape%20tea%20with%20grape%20pieces%20in%20transparent%20glass%2C%20purple%20green%20grapes%20visible%2C%20clear%20tea%20base%2C%20professional%20beverage%20photography%2C%20soft%20lighting%2C%20minimalist%20white%20background%2C%20premium%20drink&image_size=square',
    temperature: 'cold',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '满杯红柚',
    description: '新鲜西柚，清爽解腻，带来沁人心脾的柑橘芬芳',
    price: 26,
    category: 'fruit_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grapefruit%20tea%20in%20clear%20glass%20cup%2C%20pink%20red%20grapefruit%20slices%20visible%2C%20refreshing%20citrus%20drink%2C%20professional%20product%20photography%2C%20soft%20natural%20lighting%2C%20minimalist%20aesthetic%2C%20elegant%20beverage&image_size=square',
    temperature: 'cold',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '烤黑糖鹿丸鲜奶',
    description: '手工黑糖珍珠，香浓鲜奶，每一口都是温暖的治愈',
    price: 28,
    category: 'milk_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brown%20sugar%20bubble%20milk%20tea%20in%20clear%20glass%2C%20dark%20brown%20sugar%20streaks%20on%20glass%2C%20black%20pearls%20at%20bottom%2C%20fresh%20milk%2C%20professional%20product%20photography%2C%20warm%20lighting%2C%20minimalist%20background%2C%20premium%20beverage&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '鹿丸奶茶',
    description: '经典珍珠奶茶，醇香浓郁，传承不变的匠心之作',
    price: 22,
    category: 'milk_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20pearl%20milk%20tea%20in%20elegant%20glass%20cup%2C%20black%20tapioca%20pearls%20at%20bottom%2C%20creamy%20milk%20tea%2C%20professional%20beverage%20photography%2C%20soft%20lighting%2C%20minimalist%20aesthetic%2C%20premium%20quality&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '芋泥波波鲜奶',
    description: '绵密芋泥，Q弹波波，交织出丝滑的口感体验',
    price: 26,
    category: 'milk_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taro%20milk%20tea%20with%20taro%20paste%20in%20glass%2C%20purple%20taro%20swirl%2C%20chewy%20boba%20topping%2C%20fresh%20milk%2C%20professional%20product%20photography%2C%20soft%20lighting%2C%20minimalist%20background%2C%20elegant%20beverage&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '豆乳玉麒麟',
    description: '豆乳奶盖配乌龙茶底，东方茶韵与现代风味的邂逅',
    price: 25,
    category: 'milk_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soy%20milk%20cap%20oolong%20tea%20in%20clear%20glass%2C%20creamy%20soy%20foam%20on%20top%2C%20golden%20brown%20tea%20base%2C%20professional%20product%20photography%2C%20soft%20natural%20lighting%2C%20minimalist%20aesthetic%2C%20premium%20asian%20beverage&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  },
  {
    name: '纯绿妍茶',
    description: '精选绿茶，清香淡雅，品味自然的纯净',
    price: 18,
    category: 'pure_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20green%20tea%20in%20elegant%20clear%20glass%2C%20light%20green%20tea%20color%2C%20fresh%20tea%20leaves%20visible%2C%20professional%20product%20photography%2C%20soft%20natural%20lighting%2C%20minimalist%20white%20background%2C%20zen%20aesthetic&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'none',
    size: 'medium,large',
  },
  {
    name: '茉莉翠峰',
    description: '茉莉花茶，芬芳怡人，花香与茶香的完美融合',
    price: 20,
    category: 'pure_tea',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=jasmine%20tea%20in%20delicate%20glass%20cup%2C%20pale%20golden%20tea%20color%2C%20jasmine%20flowers%20floating%2C%20professional%20product%20photography%2C%20soft%20lighting%2C%20minimalist%20aesthetic%2C%20elegant%20chinese%20tea&image_size=square',
    temperature: 'cold,hot',
    sweetness: 'none',
    size: 'medium,large',
  },
];

async function main() {
  console.log('开始填充数据库...');

  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log('数据库已有产品数据，跳过填充');
    return;
  }

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`已创建产品: ${product.name}`);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@chalijiushi.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log('已创建管理员账户: admin@chalijiushi.com (密码: admin123)');

  const testUserPassword = await bcrypt.hash('test123', 10);
  await prisma.user.create({
    data: {
      email: 'test@chalijiushi.com',
      password: testUserPassword,
      name: 'Test User',
      role: 'user',
    },
  });
  console.log('已创建测试账户: test@chalijiushi.com (密码: test123)');

  console.log('数据库填充完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
