import { HomeLayout } from "../../modules/home/ui/layouts/home-layout";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <HomeLayout>{children}</HomeLayout>
    </div>
  );
};

export default Layout;
