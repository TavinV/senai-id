//Icones
import { Youtube } from "lucide-react";
import { Twitter } from "lucide-react";
import { Linkedin } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  // A cor principal do footer na imagem do Figma é um vermelho escuro, que se assemelha a bg-red-700 ou bg-red-800.
  // O código original usava bg-red-800 para a seção do meio e bg-red-500 para o copyright.
  // Vou usar bg-red-700 para o corpo principal e bg-red-800 para o copyright, para um contraste sutil e alinhamento com o Figma.

  return (
    <footer className="w-full shadow-2xl/100 bg-red-700 text-white">
      {/* Primeira Seção: Links de Navegação (Oculta no Mobile, conforme o Figma) */}
      {/* No Figma, a seção de links de navegação está dentro da área vermelha principal e não em uma nav separada.
                Vou manter a estrutura original, mas torná-la visível apenas em telas maiores (desktop)
                e remover o fundo branco/preto original, pois o Figma mostra tudo em vermelho. */}
      <nav className="hidden md:block w-full py-4 bg-red-800">
        <ul className="flex justify-around text-white">
          <li className="hover:text-red-300">
            <a href="#">Unidades</a>
          </li>
          <li className="hover:text-red-300">
            <a href="#">Perguntas Frequentes</a>
          </li>
          <li className="hover:text-red-300">
            <a href="#">Fale Conosco</a>
          </li>
          <li className="hover:text-red-300">
            <a href="#">Transparência</a>
          </li>
          <li className="hover:text-red-300">
            <a href="#">Para a sua empresa</a>
          </li>
        </ul>
      </nav>

      {/* Segunda Seção: Conteúdo Principal (Responsivo) */}
      <div className="flex flex-col md:flex-row justify-around items-start md:items-center text-white py-9 px-6 md:px-4 bg-red-700">
        {/* Layout Mobile (Figma): Empilhado verticalmente */}
        <div className="md:hidden w-full">
          {/* REDES SOCIAIS (Topo no Mobile) */}
          <div className="mb-6 pb-4 border-b border-red-600 flex flex-row justify-between">
            <p className="font-bold text-lg mb-4">REDES SOCIAIS</p>
            <div className="flex gap-6 ">
              {/* Ícones do Figma: Whatsapp, Instagram, Twitter */}
              <a href="#" aria-label="Whatsapp" className="hover:text-red-300">
                <FaWhatsapp size={28} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-red-300">
                <FaInstagram size={28} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-red-300">
                <Twitter size={28} />
              </a>
              {/* Os ícones Youtube e Linkedin do código original foram removidos para seguir o Figma, mas mantive o import caso precise */}
            </div>
          </div>

          {/* NAVEGUE (Meio no Mobile) */}
          <div className="mb-6">
            <p className="font-bold text-lg mb-4">NAVEGUE</p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-red-300">
                  Unidades
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-300">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-300">
                  Para a sua empresa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-300">
                  Fale Conosco
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-300">
                  Transparência
                </a>
              </li>
            </ul>
          </div>

          {/* CONTATO (Fundo no Mobile) */}
          <div className="mb-4">
            <p className="font-bold text-lg mb-4">CONTATO</p>
            <a
              href="tel:47283900"
              className="text-xl font-bold underline hover:text-red-300"
            >
              (11) 4728-3900
            </a>
          </div>
        </div>

        {/* Layout Desktop (Mantendo a estrutura original do usuário, mas com cores do Figma) */}
        <div className="hidden md:flex w-full justify-around items-center">
          {/* Bloco 1: INSTITUIÇÃO E EDIFÍCIO (Do código original) */}
          <div>
            <p className="font-bold">INSTITUIÇÃO E EDIFÍCIO</p>
            <p>Mogi das Cruzes - SP</p>
            <p>CEP 08780-070</p>
          </div>
          {/* Bloco 2: CENTRAL DE ATENDIMENTO (Do código original) */}
          <div>
            <p className="font-bold">CENTRAL DE ATENDIMENTO</p>
            <p>(11) 4728-3900</p>
          </div>
          {/* Bloco 3: REDES SOCIAIS (Do código original) */}
          <div>
            <p className="font-bold">REDES SOCIAIS</p>
            <div className="flex gap-3">
              <a href="#" aria-label="FaWhatsapp" className="hover:text-red-300">
                <FaWhatsapp />
              </a>
              <a href="#" aria-label="Youtube" className="hover:text-red-300">
                <Youtube />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-red-300">
                <Twitter />
              </a>
              <a href="#" aria-label="Linkedin" className="hover:text-red-300">
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Terceira Seção: Copyright (Cor Vermelha Mais Escura) */}
      {/* Cor ajustada para bg-red-800 para um contraste mais forte com o corpo principal, como no Figma. */}
      <div className="flex justify-center items-center text-white py-3 bg-red-800">
        <p className="text-sm px-6 text-center">
          Copyright {new Date().getFullYear()} © Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
