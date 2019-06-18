import { createParamDecorator } from '@nestjs/common';
import { SECRET } from '../config';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator((data, req) => {

  // if route is protected, there is a user set in auth.middleware
  const user = req.user;
  if (!!user) {
    return !!data ? user[data] : user;
  }

  // in case a route is not protected, we still want to get the optional auth user from jwt
  const token = req.headers.authorization ? (req.headers.authorization as string).split(' ') : null;
  if (token && token[1]) {
    const decoded: any = jwt.verify(token[1], SECRET);
    return !!data ? decoded[data] : decoded.user;
  }

});
