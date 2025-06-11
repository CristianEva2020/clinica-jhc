import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo-clinica-jhc.jpeg"
            alt="Logo Clínica JHC"
            width={40}
            height={40}
            className="w-auto h-auto"
            priority
          />
          <span className="text-xl font-bold text-blue-600">CLÍNICA JHC</span>
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Início</Link>
          <Link href="/servicos" className="text-gray-600 hover:text-blue-600">Serviços</Link>
          <Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
