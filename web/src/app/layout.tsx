import './globals.css'

export const metadata = {
  title: 'DHTracker - Downhill Skater Community',
  description: 'Track your downhill runs and compare stats with other riders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}




