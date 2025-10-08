import { HomeLayout } from "../modules/home/ui/layouts/home-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <HomeLayout>
        {/* <div className="p-4 bg-rose-500 w-full">navbar</div> */}
        {children}
      </HomeLayout>
    </div>
  );
};

export default Layout;
