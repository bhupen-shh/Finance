"use client";

export default function Navbar() {

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-5">

      <div>

        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-zinc-500 mt-1">
          {today}
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="rounded-full bg-black px-5 py-2 text-white">
          Admin
        </div>

      </div>

    </header>
  );
}