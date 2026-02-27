import type {SizeLimitConfig} from 'size-limit';

const config: SizeLimitConfig = [
  {
    name: "import * from 'next-lingui' (react-client)",
    path: 'dist/esm/production/index.react-client.js',
    limit: '13.715 KB'
  },
  {
    name: "import {NextIntlClientProvider} from 'next-lingui' (react-client)",
    import: '{NextIntlClientProvider}',
    path: 'dist/esm/production/index.react-client.js',
    limit: '1.015 KB'
  },
  {
    name: "import * from 'next-lingui' (react-server)",
    path: 'dist/esm/production/index.react-server.js',
    limit: '14.225 KB'
  },
  {
    name: "import {createNavigation} from 'next-lingui/navigation' (react-client)",
    path: 'dist/esm/production/navigation.react-client.js',
    import: '{createNavigation}',
    limit: '2.341 KB'
  },
  {
    name: "import {createNavigation} from 'next-lingui/navigation' (react-server)",
    path: 'dist/esm/production/navigation.react-server.js',
    import: '{createNavigation}',
    limit: '3.115 KB'
  },
  {
    name: "import * from 'next-lingui/server' (react-client)",
    path: 'dist/esm/production/server.react-client.js',
    limit: '1 KB'
  },
  {
    name: "import * from 'next-lingui/server' (react-server)",
    path: 'dist/esm/production/server.react-server.js',
    limit: '13.505 KB'
  },
  {
    name: "import * from 'next-lingui/middleware'",
    path: 'dist/esm/production/middleware.js',
    limit: '9.71 KB'
  },
  {
    name: "import * from 'next-lingui/routing'",
    path: 'dist/esm/production/routing.js',
    limit: '1 KB'
  }
];

module.exports = config;
