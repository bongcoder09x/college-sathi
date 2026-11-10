import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-2">This page is not on the campus map</h1>
      <p className="muted mx-auto mt-3 max-w-md">
        The link may be old, or the record you are looking for has moved. Try the programme catalogue or the admission
        portal.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/" className="btn-primary btn-sm">Back home</Link>
        <Link href="/programs" className="btn-outline btn-sm">Browse programmes</Link>
      </div>
    </div>
  );
}
