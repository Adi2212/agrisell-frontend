export default function Footer() {
  return (
    <footer className="bg-background border-t py-3 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} AgriSell Platform
    </footer>
  );
}
