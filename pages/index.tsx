import React, { useContext, useEffect } from "react";
import { Divider, Typography } from "antd";
import AuthContext from "../stores/authContext";
import { useRouter } from 'next/router';

const Index: React.FC = () => {
  const router = useRouter();
  const { user, login, authReady } = useContext(AuthContext);

  useEffect(() => {
    if (authReady && user) {
      router.push('/midjourney');
    }
  }, [authReady, login, router, user]);

  return (
    <div className="login-background p-10 flex items-center justify-around">
      <div>
        <Typography.Title>AI | MidJourney</Typography.Title>
        <Typography.Title>Powered Life</Typography.Title>
      </div>
      <Divider type="vertical" />
      <div>
        <button onClick={login} className="bg-white bg-opacity-20 hover:bg-opacity-50 text-white border-white border-2 p-5 rounded-lg text-3xl cursor-pointer">
          Launch App
        </button>
      </div>
    </div>
  );
};

export default Index;
