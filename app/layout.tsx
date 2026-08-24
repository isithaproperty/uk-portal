import type { Metadata } from "next";
import "./globals.css";
import "./portal.css";
import "./folders.css";
import "./checks.css";
import "./timing.css";
import "./work-orders.css";
import "./residents.css";
export const metadata:Metadata={title:"UK Managing Agent Portal",description:"Resident services, property operations and building-safety compliance in one place.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
