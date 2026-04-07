import { Link } from 'react-router-dom';
import { Instagram, Mail, MessageSquare, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white/80 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl text-white tracking-tight">
                茶里九世
              </span>
            </Link>
            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              我们相信，一杯好茶不仅仅是饮品，更是一种生活态度。精选优质原料，匠心制作每一杯，只为给您带来最纯粹的味觉享受。
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">快速链接</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/60 hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/60 hover:text-white transition-colors">
                  产品
                </Link>
              </li>
              <li>
                <Link to="/brand" className="text-white/60 hover:text-white transition-colors">
                  品牌故事
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-white/60 hover:text-white transition-colors">
                  门店
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white/60 hover:text-white transition-colors">
                  新闻
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">联系我们</h4>
            <ul className="space-y-3 text-white/60">
              <li>客服热线: 400-888-8888</li>
              <li>营业时间: 10:00 - 22:00</li>
              <li>邮箱: hello@chalijiushi.com</li>
              <li>地址: 上海市静安区南京西路1688号</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/40 text-sm">
              © {currentYear} 茶里九世. All rights reserved.
            </p>
            <p className="text-white/40 text-sm mt-2">
              ICP备案号: 沪ICP备XXXXXXXX号
            </p>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white/60 transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
