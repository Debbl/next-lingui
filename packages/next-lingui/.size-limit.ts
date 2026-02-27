import type {SizeLimitConfig} from 'size-limit';

const config: SizeLimitConfig = [
  {
    name: "import * from 'next-lingui' (react-client)",
    path: 'dist/index.react-server.js',
    limit: '13.715 KB'
  },
  {
    name: "import {NextLinguiClientProvider} from 'next-lingui' (react-client)",
    import: '{NextLinguiClientProvider}',
    path: 'dist/index.react-server.js',
    limit: '2.2 KB'
  },
  {
    name: "import * from 'next-lingui' (react-server)",
    path: 'dist/index.react-server.js',
    limit: '14.225 KB'
  },
  {
    name: "import {createNavigation} from 'next-lingui/navigation' (react-client)",
    path: 'dist/navigation.react-client.js',
    import: '{createNavigation}',
    limit: '2.36 KB'
  },
  {
    name: "import {createNavigation} from 'next-lingui/navigation' (react-server)",
    path: 'dist/navigation.react-server.js',
    import: '{createNavigation}',
    limit: '3.115 KB'
  },
  {
    name: "import * from 'next-lingui/server' (react-client)",
    path: 'dist/server.react-client.js',
    limit: '1 KB'
  },
  {
    name: "import * from 'next-lingui/server' (react-server)",
    path: 'dist/server.react-server.js',
    limit: '13.505 KB'
  },
  {
    name: "import * from 'next-lingui/middleware'",
    path: 'dist/middleware.js',
    limit: '9.71 KB'
  },
  {
    name: "import * from 'next-lingui/routing'",
    path: 'dist/routing.js',
    limit: '1 KB'
  }
];

module.exports = config;
