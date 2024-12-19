import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Admin Home</h1>
      <button className="bg-green-300 px-2 py-1 rounded-md"><Link href={'/login'}>Login</Link></button>
      <button className="bg-blue-300 px-2 py-1 rounded-md"><Link  href={'/register'}>Register</Link></button>
    </div>
  );
}
