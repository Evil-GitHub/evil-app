import { Avatar as AntAvatar, type AvatarProps } from 'antd';
import type { FC } from 'react';
import { getGradientColorFromCharCode } from '@/utils';

const Avatar: FC<
  AvatarProps & {
    name: string;
  }
> = ({ name = '', ...restProps }) => {
  return (
    <AntAvatar
      style={getGradientColorFromCharCode(name?.charCodeAt(1))}
      {...restProps}
    >
      {name.slice(-2)}
    </AntAvatar>
  );
};

export default Avatar;
