import { Button, Result } from 'antd';
import React from 'react';
import { goHome } from '@/utils/index';

const UnAccessible: React.FC = () => (
  <Result
    icon={<img src="/images/403.webp" alt="403" />}
    subTitle="抱歉，你无权访问该页面"
    extra={
      <Button type="primary" onClick={goHome}>
        返回首页
      </Button>
    }
  />
);

export default UnAccessible;
