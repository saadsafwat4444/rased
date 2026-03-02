"use client";

import { DotLoader } from "react-spinners";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <DotLoader color="#2563EB" size={50} />
    </div>
  );
}