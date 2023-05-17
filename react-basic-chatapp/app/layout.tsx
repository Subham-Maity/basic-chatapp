// Import dependencies
import Head from "next/head";
import Link from "next/link";

// Define the props type
type Props = {
  children: React.ReactNode;
};

// Create a Layout component
const Layout: React.FC<Props> = ({ children }) => {
  // Return a div element that contains a Head element for the title and favicon, a Link element for the home page, and the children elements
  return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Head>
          <title>Next.js Chat App</title>
          <Link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="container mx-auto max-w-4xl p-4">
          <Link href="/">
            <a className="text-4xl font-bold">Next.js Chat App</a>
          </Link>
          {children}
        </div>
      </div>
  );
};

export default Layout;
