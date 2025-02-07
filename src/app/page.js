import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      {/* Title & Description */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to GroceryList</h1>
        <p className="text-lg text-gray-700 mt-2">
          Your one-stop solution for managing everything efficiently.
        </p>
      </div>

      {/* Image Section */}
      {/* <div className="mt-6">
        <Image src="/vercel.svg" alt="Vercel Logo" width={120} height={30} />
      </div> */}

      {/* Call-to-Action Button */}
      <div className="mt-6">
        <Link href={"/dashboard"} className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700">
          Get Started
        </Link>
      </div>
    </div>
  );
}
