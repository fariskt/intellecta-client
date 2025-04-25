import {  useState } from "react";
import { motion } from "framer-motion";
import IntellectaLogo from "../../../assets/userDashAssets/intelLogo.png"
import { 
  LucideLayoutDashboard, 
  FileStack, 
  // BrainCircuit, 
  Library, 
  Gift, 
  UserCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDashNavProps {
  setString: (value: string) => void;
  string:string;
}

const UserDashNav = ({ setString ,string }: UserDashNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  
  const isDesktop = () => window.innerWidth >= 1000

  console.log("string in the userdash component", string)

  const navItems = [
    {
      icon: <LucideLayoutDashboard size={20} />,
      name: "Dashboard",
      link: "/"
    },
    {
      icon: <FileStack size={20} />,
      name: "My Course",
      link: "/courses"
    },
    // {
    //   icon: <BrainCircuit size={20} />,
    //   name: "AI Support",
    //   link: "/ai-support"
    // },
    // {
    //   icon: <Library size={20} />,
    //   name: "Resources",
    //   link: "/resources"
    // },
    // {
    //   icon: <Gift size={20} />,
    //   name: "Rewards",
    //   link: "/rewards"
    // },
    // {
    //   icon: <UserCircle size={20} />,
    //   name: "Profile",
    //   link: "/profile"
    // }
  ];

  return (
    <motion.nav
      onMouseEnter={() => isDesktop() && setIsOpen(true)}
      onMouseLeave={() => isDesktop() && setIsOpen(false)}
      initial={{ width: "4rem" }}
      animate={{ width: isOpen ? "14rem" : "4rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 left-0 h-screen bg-white shadow-lg   overflow-hidden  "
    >
      <div className="py-4 px-2 ">
        <div className="flex items-center gap-3">
          <img
            src={IntellectaLogo}
            alt="Intellecta Logo"
            className={`${isOpen ? "w-10 h-10" : "w-8 h-8"} object-contain opacity-80`}
          />
          {isOpen && (
            <div className="text-black">
              <h1 className=" bg-gradient-to-r from-[#183564]  to-[#488daf] bg-clip-text text-transparent font-bold">INTELLECTA</h1>
           {/* <p className="text-xs text-black">Learn, Grow, Succeed</p> */}
            </div>
          )}
        </div>
      </div>

      <div className={`flex flex-col py-4 space-y-1 ${isOpen ? "px-2" : "pl-2"} `}>
  {navItems.map((item, index) => (
    <div
      key={index}
      onClick={() => {
        setString(item.name);
        if (item.name === "Profile") {
          navigate("profile",{ replace: true });
        }
      }}
      className={`flex items-center gap-4 pl-3 py-2.5 text-black hover:bg-[#79c6ec] hover:rounded-lg transition-colors cursor-pointer ${
        string === item.name && !isOpen && "border-r-6 border-[#66a5c5]"
      } ${string === item.name && isOpen && " bg-[#66a5c5] rounded-lg "}`}
    >
      <span>{item.icon}</span>
      {isOpen && <span className="whitespace-nowrap text-sm ">{item.name}</span>}
    </div>
  ))}
</div>

    </motion.nav>
  );
};

export default UserDashNav;


//bg-gradient-to-b from-[#081A37] to-[#3A6073]