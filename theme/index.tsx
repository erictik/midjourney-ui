import React from "react";
import { ConfigProvider } from "antd";
import en from 'antd/locale/en_US';

const withTheme = (node: JSX.Element) => (
    <>
      <ConfigProvider
      locale={en}
        theme={{
          token: {
            colorPrimary: '#030303',
          },
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 16,
            },
          }}
        >
          {node}
        </ConfigProvider>
      </ConfigProvider>
    </>
  )

export default withTheme;