import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Import icons từ react-icons
import { FaFacebook, FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {
	return (
		<footer className="mt-auto text-white transition-colors bg-brand-text dark:bg-gray-900">
			<div className="container-custom py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Column 1 - Brand */}
					<div>
						<h3 className="mb-2 text-2xl font-bold tracking-wider text-white font-display dark:text-white">
							TRANG ALLURE
						</h3>
						<div className="flex flex-wrap gap-1 text-sm text-white/70 dark:text-gray-400">
							<span>6,7K người theo dõi</span>
							<span>·</span>
							<span>4,2K đang theo dõi</span>
						</div>
						<div className="flex flex-wrap gap-1 mt-3 text-sm font-medium text-white/80 dark:text-gray-300">
							<span className="transition cursor-pointer hover:text-brand-secondary">
								Túi Auth
							</span>
							<span className="text-white/30 dark:text-gray-600">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">
								Đồng Hồ
							</span>
							<span className="text-white/30 dark:text-gray-600">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">
								Mỹ Phẩm
							</span>
							<span className="text-white/30 dark:text-gray-600">·</span>
							<span className="transition cursor-pointer hover:text-brand-secondary">
								Phụ Kiện
							</span>
						</div>
						<p className="mt-3 text-base text-white/80 dark:text-gray-300">
							Có gu · Có tấm · Ship toàn quốc{" "}
							<Heart
								className="inline w-4 h-4 text-brand-secondary"
								fill="#FFB7C5"
							/>
						</p>
						<p className="mt-1 text-sm text-gray-300 dark:text-gray-400">
							Mua sắm &amp; bán lẻ
						</p>
					</div>

					{/* Column 2 - Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold text-white/90 dark:text-gray-200">
							Liên kết nhanh
						</h4>
						<ul className="space-y-2 text-sm opacity-80 text-white/80 dark:text-gray-300">
							<li>
								<Link
									to="/"
									className="transition hover:text-brand-secondary dark:hover:text-brand-secondary"
								>
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
						<div className="flex flex-wrap gap-4">
							{/* Facebook - Thêm role="img" và aria-label */}
							<a
								href="https://www.facebook.com/trangallure.shop"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Facebook"
							>
								<FaFacebook className="w-5 h-5" aria-hidden="true" />
							</a>

							{/* Messenger */}
							<a
								href="https://m.me/trangallure.shop"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Messenger"
							>
								<FaFacebookMessenger className="w-5 h-5" aria-hidden="true" />
							</a>

							{/* Zalo */}
							<a
								href="https://zalo.me/0905990862"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Zalo"
							>
								<SiZalo className="w-5 h-5" aria-hidden="true" />
							</a>

							{/* Hotline */}
							<a
								href="tel:0905990862"
								className="p-3 transition rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Hotline"
							>
								<Phone className="w-5 h-5" aria-hidden="true" />
							</a>
						</div>

						<div className="p-3 mt-4 rounded-lg bg-white/10 dark:bg-white/5">
							<p className="text-xs text-white/70 dark:text-gray-400">
								📞 Liên hệ ngay để được tư vấn!
							</p>
						</div>
					</div>
				</div>
				{/* Bottom bar */}
				<div className="pt-6 mt-8 text-sm text-center border-t border-white/20 dark:border-gray-700 text-gray-300 dark:text-gray-400">
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
