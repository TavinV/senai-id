import background from '../../assets/bg.png';

export default function MainContent({ children, className }) {
    return (
        <main 
            className={`w-full flex flex-col md:flex-row items-center pt-4 sm:pt-8 md:pt-20 justify-center gap-4 sm:gap-6 md:gap-8 px-3 sm:px-4 md:px-8 overflow-x-hidden ${className}`} 
            style={{ 
                backgroundImage: `url(${background})`, 
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                minHeight: 'calc(100vh - 120px)'
            }}
        >
            {children}
        </main>
    );
}
