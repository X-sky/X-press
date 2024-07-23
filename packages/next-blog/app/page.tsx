import Image from 'next/image';

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Image src="/xt-logo.svg" width={24} height={24} alt="x-press-logo" />
      <h1 className="flex items-center justify-center text-2xl font-bold">
        Read <Link href="/posts/first-post">First Post</Link>
      </h1>
    </main>
  );
}
