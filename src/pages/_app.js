import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Component {...pageProps} />
        </div>
    );
}