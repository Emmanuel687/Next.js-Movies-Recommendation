// Imports Start
import Header from "./components/Header";
import Providers from "./components/Theme";
import { PrimeReactProvider } from "primereact/api";
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
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
			>
				<Providers>
					<PrimeReactProvider>
						<Header />
						<main>{children}</main>
					</PrimeReactProvider>
				</Providers>
			</body>
		</html>
	);
}
