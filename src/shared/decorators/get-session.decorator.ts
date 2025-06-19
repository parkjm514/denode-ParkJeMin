import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSession = createParamDecorator(
  (key: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.session) {
      return undefined;
    }
    const { session } = request;
    return session;
  },
);
