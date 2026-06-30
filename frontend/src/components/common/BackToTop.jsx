import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    isVisible && (
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg bg-brand-text hover:bg-brand-text/80 text-white z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    )
  );
};

export default BackToTop;