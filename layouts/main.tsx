import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { ReactNode } from 'react';

import {
  SmileOutlined,
} from '@ant-design/icons'
import withTheme from '../theme';

import { Route, MenuDataItem } from '@ant-design/pro-layout/lib/typing'
const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
})

const ROUTES: Route = {
  path: '/',
  routes: [
    {
      path: '/',
      name: 'MidJourney',
      icon: <SmileOutlined />,
    },
  ],
}

const menuHeaderRender = (
  logo: React.ReactNode,
  title: React.ReactNode,
) => (
    <Link href="/">
        {logo}
        {title}
    </Link>
  )

const menuItemRender = (options: MenuDataItem, element: React.ReactNode) => (
  <Link href={options.path ?? '/'}>
   {element}
  </Link>
)
interface MainProps {
  children: ReactNode;
}
export default function Main({ children }: MainProps) {
  return withTheme(
    <ProLayout
      logo={"logo.png"}
      title="AI Draw"
      style={{ minHeight: '100vh' }}
      route={ROUTES}
      menuItemRender={menuItemRender}
      menuHeaderRender={menuHeaderRender}
    >
      {children}
    </ProLayout>
  )
}
