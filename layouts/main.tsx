import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";

import { GithubFilled } from "@ant-design/icons";
import { Image, Button, Divider } from "antd";
import MJLogo from "../images/mj-logo.png";

import { Route, MenuDataItem } from "@ant-design/pro-layout/lib/typing";
import { ProConfigProvider } from "@ant-design/pro-components";

import AuthContext from "../stores/authContext";
import { useRouter } from "next/router";

const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
  ssr: false,
});

const ROUTES: Route = {
  path: "/midjourney",
  routes: [
    {
      path: "/midjourney",
      name: "MidJourney",
      icon: <Image src={MJLogo.src} alt="midjourney" width={15} height={15} />,
    },
  ],
};

const menuHeaderRender = (logo: React.ReactNode, title: React.ReactNode) => (
  <Link href="/midjourney">
    {logo}
    {title}
  </Link>
);

const menuItemRender = (options: MenuDataItem) => (
  <Link href={options.path ?? "/midjourney"}>
    {options.icon}
    <Divider type="vertical" />
    {options.name}
  </Link>
);

export default function Main({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    // Check the theme when the user first visits the page
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDark(true);
    } else {
      setDark(false);
    }
    // Monitor the change of the theme of the system
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          setDark(true);
        } else {
          setDark(false);
        }
      });
  }, []);

  const router = useRouter();
  const { user, authReady, logout, type } = useContext(AuthContext);
  useEffect(() => {
    if (authReady && !user) {
      router.push("/");
    }
  }, [authReady, user, router, logout]);

  return (
    <ProConfigProvider dark={dark} hashed={false}>
      <ProLayout
        logo={"/logo.png"}
        title="AI Draw"
        style={{ minHeight: "100vh" }}
        route={ROUTES}
        avatarProps={{
          src: "/logo.png",
          title: user?.user_metadata?.full_name,
        }}
        actionsRender={(props) => {
          const _list = [];
          if (type !== "no")
            _list.push(
              <Button type="primary" danger ghost onClick={logout} key="logout">
                Logout
              </Button>
            );
          if (!props.isMobile) {
            _list.push(
              <Link href="https://github.com/erictik/midjourney-ui" key="about">
                <GithubFilled
                  style={{
                    fontSize: 24,
                  }}
                />
              </Link>
            );
          }
          return _list;
        }}
        menuItemRender={menuItemRender}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: "center",
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
  );
}
