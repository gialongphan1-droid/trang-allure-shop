import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import SEO from '@/components/common/SEO';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Điện thoại',
      value: '0905 990 862',
      href: 'tel:0905990862',
      color: 'bg-green-500',
    },
    {
      icon: MessageCircle,
      label: 'Zalo',
      value: '0905 990 862',
      href: 'https://zalo.me/0905990862',
      color: 'bg-blue-600',
    },
    {
      icon: 'facebook',
      label: 'Facebook',
      value: 'TrangAllure Shop',
      href: 'https://www.facebook.com/trangallure.shop',
      color: 'bg-blue-700',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'gialongphan1@gmail.com',
      href: 'mailto:gialongphan1@gmail.com',
      color: 'bg-red-500',
    },
  ];

  const renderIcon = (icon, className) => {
    if (icon === 'facebook') {
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }
    const IconComponent = icon;
    return <IconComponent className={className} />;
  };

  return (
    <>
      <SEO 
        title="Liên hệ - TrangAllure Shop"
        description="Liên hệ với TrangAllure Shop qua điện thoại, Zalo, Facebook hoặc email. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7."
        url="https://trangallure.shop/lien-he"
        keywords="liên hệ, mỹ phẩm, tư vấn, hỗ trợ"
      />
      
      <div className="container px-4 py-8 mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-brand-text">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-1 text-gray-600">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-text">
              Thông tin liên hệ
            </h2>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : ''}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="flex items-center gap-4 p-4 transition bg-white shadow-sm rounded-xl hover:shadow-md"
                >
                  <div className={`${item.color} p-3 rounded-full text-white`}>
                    {renderIcon(item.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-medium text-brand-text">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-brand-text">
                Liên hệ nhanh
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://m.me/trangallure.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messenger
                </a>
                <a
                  href="https://zalo.me/0905990862"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Phone className="w-4 h-4" />
                  Zalo
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Address & Map */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-semibold text-brand-text">
                Địa chỉ
              </h2>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>TP. Hồ Chí Minh, Việt Nam</p>
              </div>
              <div className="p-4 mt-4 rounded-lg bg-brand-background">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Giờ làm việc:</span><br />
                  Thứ 2 - Thứ 7: 8:00 - 21:00<br />
                  Chủ nhật: 9:00 - 18:00
                </p>
              </div>
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h2 className="mb-4 text-xl font-semibold text-brand-text">
                Bản đồ
              </h2>
              <div className="flex items-center justify-center text-gray-400 bg-gray-200 rounded-lg aspect-video">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto text-brand-primary" />
                  <p className="mt-2">TP. Hồ Chí Minh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;