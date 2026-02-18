import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                D
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Dev<span className="text-primary">Circuit</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Premium gear for developers, by developers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=keyboards" className="hover:text-primary transition-colors">Keyboards</Link></li>
                            <li><Link href="/products?category=mice" className="hover:text-primary transition-colors">Mice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/#terms" className="hover:text-primary transition-colors">Terms & Privacy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 DevCircuit. All rights reserved.</p>
                    <p>Built with ❤️ for the community.</p>
                </div>
            </div>
        </footer>
    );
}
