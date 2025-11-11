import background from '../../assets/bg.png';

export default function MainContent({ children, className }) {
    return (
        <main 
            className={`w-full flex items-start pt-8 md:pt-20 justify-center gap-8 md:gap-30 ${className}`} 
            style={{ 
                backgroundImage: `url(${background})`, 
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed', // Para um efeito de paralaxe ou para garantir que o fundo cubra toda a área
                minHeight: 'calc(100vh - 60px)' // Ajuste para garantir que ocupe a tela, considerando a altura do header
            }}
        >
            {children}
        </main>
    );
}
