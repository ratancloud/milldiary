import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 px-4 md:flex-row md:py-6 md:px-8 max-w-screen-2xl mx-auto">
        {/* 1. Copyright */}
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left order-3 md:order-1">
          &copy; {new Date().getFullYear()} Ratan Kumar. All rights reserved.
        </p>

        {/* 2. Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-2">
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link 
            href="/contact-us" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>

        {/* 3. Social Icons */}
        <div className="flex items-center gap-4 order-1 md:order-3">
          <Link 
            href="#" 
            className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-full hover:bg-accent"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link 
            href="#" 
            className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-full hover:bg-accent"
          >
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}