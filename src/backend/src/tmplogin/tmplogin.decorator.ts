import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const TmpLogin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.data.user;
  },
);
