import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'First Post',
};
export default function FirstPost() {
  return (
    <>
      <h1>First Post</h1>
      <div>
        back to
        <Link href="/">home page</Link>
      </div>
    </>
  );
}
