import "./globals.css";

export const metadata = {
  title: "DSA Playground - Interactive Algorithm Visualizations",
  description: "Learn Data Structures and Algorithms through interactive visualizations and real-world applications. Master sorting, searching, graph algorithms and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}

