// Imports Start
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Providers from "./components/Theme";
import { PrimeReactProvider } from "primereact/api";
import { ClerkProvider } from "@clerk/nextjs";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./globals.css";
// Imports End

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body suppressHydrationWarning>
					<Providers>
						<PrimeReactProvider>
							<Header />
							<Navbar />
							<main>{children}</main>
						</PrimeReactProvider>
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
