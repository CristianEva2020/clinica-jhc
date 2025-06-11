const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 py-6">
      <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} CLINICA JHC. Todos os direitos reservados.
        {/* Adicionar mais informações de contato ou links aqui */}
      </div>
    </footer>
  );
};

export default Footer;
