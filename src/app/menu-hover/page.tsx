import Header from "@/app/menu-hover/(components)/Header";
import HoverScreen from "@/app/menu-hover/(components)/HoverScreen";
import { MenuProvider } from "@/app/menu-hover/(context)/MenuContext";

const Page = () => {
  return (
    <main className="relative h-screen w-screen bg-black text-white">
      <MenuProvider
        initialState={{
          view: {
            bgColor: "green",
          },
        }}
      >
        <Header />
        <HoverScreen />
      </MenuProvider>
    </main>
  );
};

export default Page;
