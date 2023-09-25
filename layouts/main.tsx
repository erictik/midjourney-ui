import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react';

import {
  GithubFilled,
} from '@ant-design/icons';
import { Image, Button } from 'antd';
import MJLogo from '../images/mj-logo.png';

import { Route, MenuDataItem } from '@ant-design/pro-layout/lib/typing'
import { ProConfigProvider } from '@ant-design/pro-components';

import AuthContext from "../stores/authContext";
import { useRouter } from 'next/router';


const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
})

const ROUTES: Route = {
  path: '/',
  routes: [
    {
      path: '/midjourney',
      name: 'MidJourney',
      icon: <Image src={MJLogo.src} alt='midjourney' width={15} height={15} />,
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

export default function Main(children: JSX.Element) {
  const [dark, setDark] = useState(false);
  const { user, authReady, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log(user, authReady);
    if (authReady && !user) {
      router.push('/');
    }
  }, [authReady, user, router])

  useEffect(() => {
    // Check the theme when the user first visits the page
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
    } else {
      setDark(false);
    }
    // Monitor the change of the theme of the system
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        setDark(true);
      } else {
        setDark(false);
      }
    });
  }, []);

  return (
    <ProConfigProvider
      dark={dark}
      hashed={false}>
      <ProLayout
        logo={"/logo.png"}
        title="AI Draw"
        style={{ minHeight: '100vh' }}
        route={ROUTES}
        avatarProps={{
          src: '/logo.png',
          title: user?.user_metadata?.full_name,
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [<Button type="primary" danger ghost onClick={logout} key="logout">Logout</Button>];
          return [
            <Button type="primary" danger ghost onClick={logout} key="logout">Logout</Button>,
            <Link href="https://github.com/erictik/midjourney-ui" key="about">
             <GithubFilled  style={{
              fontSize: 24,
             }}/>
            </Link>,
          ];
        }}
  
        menuItemRender={menuItemRender}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              Power by Midjourney
            </p>
          );
        }}
        menuHeaderRender={menuHeaderRender}
      >
        {children}
      </ProLayout>
    </ProConfigProvider>
  )
}
