"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Compass,
  Search,
  User,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userProfile , setUserProfile] = useState({});
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    fetchCurrentUser();
  },[])
  
  const fetchCurrentUser = async()=>{
    const response = await authService.getProfile();
    if(response){
      console.log("User data fetched successfully", response);
      setUserProfile(response);
      setIsUserLoggedIn(true);
    }
    else{
      console.log("Failed to fetch user data");
      setIsUserLoggedIn(false);
    }
  }
  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      console.log("Logout successful", response);
      setIsUserLoggedIn(false);
      router.push('/auth/login')
    } catch (error) {
      console.error("Logout failed", error);
    }
  }



  return (
    <nav className="bg-zinc-950 text-white py-3 px-6 flex items-center justify-between shadow-lg border-b border-zinc-800">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
          SkillSync
        </h1>

        {/* Navigation Menu using shadcn components */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex space-x-1">
            <NavigationMenuItem>
              <Link href="/home"  passHref>
                <NavigationMenuLink asChild>
                  <div className="flex flex-row items-center space-x-2">
                    <Home size={16} />
                    <span>Home</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/explore" passHref>
                <NavigationMenuLink asChild >
                  <div className="flex flex-row items-center space-x-2">
                    <Compass size={16} />
                    <span>Explore</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:flex items-center">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search"
            className="w-64 pl-10 pr-4 bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500"
          />
        </div>

        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-500">
            3
          </Badge>
        </Button>

        {/* Messages Button */}
        <Button variant="ghost" size="icon">
          <MessageSquare size={20} />
        </Button>

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full h-8 w-8 p-0 text-white"
            >
              <Avatar>
                <AvatarImage src={userProfile.profile_picture} alt="User Avatar" />
                <AvatarFallback className="bg-zinc-800">JS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-1 bg-zinc-900 border border-zinc-800"
          >
            <DropdownMenuLabel className="flex items-center space-x-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.profile_picture} alt="User Avatar" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {userProfile.first_name} {userProfile.last_name}
                </span>
                <span className="text-xs text-zinc-400">
                  {userProfile.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700">
              <User size={16} />
              <span className="text-white">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700">
              <Settings size={16} />
              <span className="text-white">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer text-red-500 hover:bg-zinc-700 focus:bg-zinc-700 focus:text-red-500">
              <LogOut size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
