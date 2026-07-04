import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Mail, 
  Heart 
} from "lucide-react";

const Footer = () => {
	return (
		<footer className="mt-auto text-white transition-colors bg-brand-text dark:bg-gray-900">
			<div className="py-12 container-custom">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Column 1 - Brand */}
					<div>
						<h3 className="mb-2 text-2xl font-bold tracking-wider text-white font-display dark:text-white">
							TRANG ALLURE
						</h3>
						
						<div className="flex flex-wrap gap-1 text-sm text-white/70 dark:text-gray-400 dark:text-gray-500">
							<span>6,7K người theo dõi</span>
							<span>·</span>
							<span>4,2K đang theo dõi</span>
						</div>

						<div className="flex flex-wrap gap-1 mt-3 text-sm font-medium text-white/80 dark:text-gray-300">
							<span className="transition cursor-pointer hover:text-brand-secondary">Túi Auth</span>
							<span className="text-white/30 dark:text-gray-600 dark:text-gray-300">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">Đồng Hồ</span>
							<span className="text-white/30 dark:text-gray-600 dark:text-gray-300">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">Mỹ Phẩm</span>
							<span className="text-white/30 dark:text-gray-600 dark:text-gray-300">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">Phụ Kiện</span>
						</div>

						<p className="mt-3 text-base text-white/80 dark:text-gray-300">
							Có gu · Có tấm · Ship toàn quốc <Heart className="inline w-4 h-4 text-brand-secondary" fill="#FFB7C5" />
						</p>

						<p className="mt-1 text-sm text-white/50 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
							Mua sắm &amp; bán lẻ
						</p>
					</div>

					{/* Column 2 - Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold text-white/90 dark:text-gray-200">Liên kết nhanh</h4>
						<ul className="space-y-2 text-sm opacity-80 text-white/80 dark:text-gray-300">
							<li>
								<Link to="/" className="transition hover:text-brand-secondary dark:hover:text-brand-secondary">
									Trang chủ   
								</Link>
							</li>
							<li>
								<Link
									to="/san-pham"
									className="transition hover:text-brand-secondary dark:hover:text-brand-secondary"
								>
									Sản phẩm
								</Link>
							</li>
							<li>
								<Link
									to="/lien-he"
									className="transition hover:text-brand-secondary dark:hover:text-brand-secondary"
								>
									Liên hệ
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3 - Contact */}
					<div>
						<h4 className="mb-4 font-semibold text-white/90 dark:text-gray-200">
							Thông tin liên hệ
						</h4>
						<div className="space-y-3 text-sm text-white/80 dark:text-gray-300">
							<p className="flex items-center gap-2">
								<Phone className="flex-shrink-0 w-4 h-4" />
								<span>0905 990 862</span>
							</p>
							<p className="flex items-center gap-2">
								<Mail className="flex-shrink-0 w-4 h-4" />
								<span>gialongphan1@gmail.com</span>
							</p>
							<p className="flex items-center gap-2">
								<MapPin className="flex-shrink-0 w-4 h-4" />
								<span>TP. Hồ Chí Minh, Việt Nam</span>
							</p>
						</div>
					</div>

					{/* Column 4 - Social */}
					<div>
						<h4 className="mb-4 font-semibold text-white/90 dark:text-gray-200">
							Kết nối với chúng tôi
						</h4>
						<div className="flex gap-4">
							<a
								href="https://www.facebook.com/trangallure.shop"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Facebook"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</a>
							<a
								href="https://m.me/trangallure.shop"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Messenger"
							>
								<MessageCircle className="w-5 h-5" />
							</a>
							<a
								href="https://zalo.me/0905990862"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Zalo"
							>
								<Phone className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Instagram"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
								</svg>
							</a>
						</div>
						<div className="p-3 mt-4 rounded-lg bg-white/10 dark:bg-white/5">
							<p className="text-xs text-white/70 dark:text-gray-400 dark:text-gray-500">
								📞 Liên hệ ngay để được tư vấn!
							</p>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="pt-6 mt-8 text-sm text-center border-t border-white/20 dark:border-gray-700 text-white/60 dark:text-gray-400 dark:text-gray-500">
					<p>
						© {new Date().getFullYear()} TrangAllure Shop. All rights reserved.
					</p>
					<p className="mt-1 text-xs opacity-50 dark:opacity-40">
						Thiết kế bởi Phan Gia Long | Mỹ phẩm chính hãng
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;