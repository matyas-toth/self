export function Page({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pt-[270px] pb-32 sm:pt-[440px]">
      {children}
    </main>
  );
}
