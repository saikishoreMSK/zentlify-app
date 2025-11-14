import Link from 'next/link';

interface AffiliateButtonProps {
  url: string;
  text?: string;
}

export default function AffiliateButton({ url, text = 'Buy on Amazon' }: AffiliateButtonProps) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-brand-accent text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-transform active:scale-95"
    >
      {text}
    </Link>
  );
}