import React, { useContext, useState, useEffect } from "react";
import { Divider, Typography, Input, Space, Button } from "antd";
import AuthContext from "../stores/authContext";
import Link from "next/link";
import { useRouter } from "next/router";

const Index: React.FC = () => {
  const { user, login, authReady, type, loginWithCode } =
    useContext(AuthContext);
  const [code, setCode] = useState("");
  const route = useRouter();

  useEffect(() => {
    if (authReady && user) {
      route.push("/midjourney");
    }
  }, [authReady, user, route]);

  return (
    <div className="login-background p-10 flex items-center justify-around">
      <div>
        <Typography.Title>AI | MidJourney</Typography.Title>
        <Typography.Title>Powered Life</Typography.Title>
      </div>
      <Divider type="vertical" />
      <div>
        {authReady && user ? (
          <Link href="/midjourney">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-50 text-white border-white border-2 p-5 rounded-lg text-3xl cursor-pointer">
              Launch App
            </button>
          </Link>
        ) : (
          <>
            {type === "code" && (
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Enter Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onPressEnter={(e) =>
                    loginWithCode && loginWithCode(e.currentTarget.value)
                  }
                  size="large"
                />
                <Button
                  size="large"
                  type="primary"
                  onClick={() => loginWithCode && loginWithCode(code)}
                >
                  Login
                </Button>
              </Space.Compact>
            )}
            {type === "netlify" && (
              <button
                onClick={login}
                className="bg-white bg-opacity-20 hover:bg-opacity-50 text-white border-white border-2 p-5 rounded-lg text-3xl cursor-pointer"
              >
                Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      ssr: false, // 禁用 SSR
    },
  };
}

export default Index;
