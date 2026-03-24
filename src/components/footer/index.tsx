const navLinks = [
  { href: '/home',           label: 'Início'    },
  { href: '/about',          label: 'Sobre nós' },
  { href: '/header/surgery', label: 'Cirurgias' },
  { href: '/header/onDuty',  label: 'Plantões'  },
  { href: '/contact',        label: 'Contato'   },
];

const contactInfo = [
  'R. Gen. Flores da Cunha, 850',
  'Centro — Nova Prata, RS',
  'contato@clinivet.com.br',
  '(54) 99999-9999',
  'CNPJ: 00.000.000/0000-00',
];

const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
];

interface SocialLinkProps {
  href: string;
  label: string;
  path: string;
}

function SocialLink({ href, label, path }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-green-600 hover:bg-white flex items-center justify-center transition duration-200 group"
    >
      <svg className="w-4 h-4 text-white group-hover:text-green-700 transition duration-200" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-green-700 w-full">

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Marca */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CliniVet" className="h-10 w-10 object-contain" />
            <span className="text-white font-bold text-xl tracking-wide">CliniVet</span>
          </div>
          <p className="text-sm leading-relaxed text-green-100">
            Cuidado e bem-estar para cães e gatos com excelência, tecnologia e muito carinho.
          </p>
          <div className="flex gap-3 mt-1">
            {socialLinks.map((s) => (
              <SocialLink key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-1">
            Navegação
          </h3>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-green-100 hover:text-white transition duration-200 w-fit">
              {label}
            </a>
          ))}
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-1">
            Contato
          </h3>
          {contactInfo.map((line) => (
            <p key={line} className="text-sm text-green-100">{line}</p>
          ))}
        </div>

      </div>

      <div className="border-t border-green-600">
        <p className="text-center text-xs text-green-200 py-4">
          © {new Date().getFullYear()} CliniVet. Todos os direitos reservados.
        </p>
      </div>

    </footer>
  );
}
