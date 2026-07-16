import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Điện thoại',
      value: '0905 990 862',
      href: 'tel:0905990862',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: MessageCircle,
      label: 'Zalo',
      value: '0905 990 862',
      href: 'https://zalo.me/0905990862',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: 'facebook',
      label: 'Facebook',
      value: 'TrangAllure Shop',
      href: 'https://www.facebook.com/trangallure.shop',
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'gialongphan1@gmail.com',
      href: 'mailto:gialongphan1@gmail.com',
      color: 'bg-red-500 hover:bg-red-600',
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
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-brand-text">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-2 text-muted-foreground">
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
                  className="flex items-center gap-4 p-4 transition-all duration-200 bg-white border border-border rounded-xl hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className={`${item.color} p-3 rounded-full text-white transition-colors`}>
                    {renderIcon(item.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-brand-text">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Liên hệ nhanh</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <a
                  href="https://m.me/trangallure.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messenger
                </a>
                <a
                  href="https://zalo.me/0905990862"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  Zalo
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Address & Map */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Địa chỉ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-primary" />
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
                <div className="p-4 rounded-lg bg-brand-background/50 border border-brand-primary/10">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-brand-text">Giờ làm việc:</span><br />
                    Thứ 2 - Thứ 7: <span className="text-foreground">8:00 - 21:00</span><br />
                    Chủ nhật: <span className="text-foreground">9:00 - 18:00</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bản đồ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center bg-muted/30 rounded-lg aspect-video border border-border">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-brand-primary/50" />
                    <p className="mt-2 text-muted-foreground">TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;