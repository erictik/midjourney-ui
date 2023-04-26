import React from "react";
import { ConfigProvider } from "antd";
import en from 'antd/locale/en_US';

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      locale={en}
      theme={{
        token: {
          colorPrimary: '#393939',
          borderRadius:8,
        },
      }}
    >
      {node}
    </ConfigProvider>
  </>
)

export default withTheme;