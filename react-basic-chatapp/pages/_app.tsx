// Import dependencies
import { AppProps } from "next/app";

import Layout from "@/app/layout";


// Override the default App component
function MyApp({ Component, pageProps }: AppProps) {
    return (
        // Wrap all pages with the Layout component
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
