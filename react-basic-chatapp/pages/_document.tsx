// Import dependencies
import Document, { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

// Override the default Document component
class MyDocument extends Document {
    render() {
        return (
            // Return an Html element that contains a Head element with Tailwind CSS imports, and a body element with the Main and NextScript components
            <Html>
                <Head>
                    <Link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
                        integrity="sha512-wnea99uKIC3TJF7v4eKk4Y+lMz2Mklv18+r4na2Gn1abDRPPOeef95xTzdwGD9e6zXJBteMIhZ1+68QC5byJZw=="
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
