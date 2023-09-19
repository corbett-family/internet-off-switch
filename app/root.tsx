// root.tsx
import React, { useContext, useEffect } from 'react';
import { withEmotionCache } from '@emotion/react';
import { ChakraProvider, extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { LinksFunction, V2_MetaFunction } from '@remix-run/node'; // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from './context';
import { mode } from '@chakra-ui/theme-tools';
import { cardTheme } from '~/card-theme';
import standardMeta from '~/standard-meta';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'charset', content: 'utf-8' }, ...standardMeta];
};

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData?.reset();
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style key={key} data-emotion={`${key} ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
});

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const theme = extendTheme({
  colors,
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('black.50', 'black')(props),
      },
    }),
  },
  components: {
    Card: cardTheme,
  },
  shadows: {
    base: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
  },
});

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
