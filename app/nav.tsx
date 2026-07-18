"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navStyles } from '@/mycss/styles';

export default function Navbar() {
  const pathname = usePathname();

  // Array containing paths and their display labels
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Go to About', href: '/about' },
    { label: 'View users', href: '/user' },
    { label: 'Login', href: '/login' },
    { label: 'Signup', href: '/signup' },
  ];

  return (
    <>
      <nav style={navStyles.navbar}> 
        <h1 style={navStyles.siteName}>WBapp</h1> 
        
        <div style={navStyles.rightContainer}>
          {navLinks.map((link) => {
            // Check if the current route matches the link path
            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.href}
                href={link.href} 
                style={{
                  ...navStyles.linkDefault,
                  ...(isActive ? navStyles.linkActive : {}) // Merges active styles if matched
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav> 
    </>
  );
}
