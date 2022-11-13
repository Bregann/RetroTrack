import 'bootstrap/dist/css/bootstrap.min.css';
import RootStyleRegistry from './emotion';

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en-US">
        <head />
        <body>
          <RootStyleRegistry>{children}</RootStyleRegistry> {/* temp due to mantine not supporting nextjs 13 yet https://github.com/mantinedev/mantine/issues/2815*/}
        </body>
      </html>
    );
  }