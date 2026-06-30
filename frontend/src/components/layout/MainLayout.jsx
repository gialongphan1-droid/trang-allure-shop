import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import BackToTop from '../common/BackToTop';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen transition-colors bg-background text-foreground">
      <Header />
      <main className="flex-1 py-8 container-custom">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;