import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

type AsyncHandler = (
  request: Request,
  ...args: any[]
) => Promise<NextResponse>;

export const asyncHandler = (handler: AsyncHandler) => {
  return async (request: Request, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('Error:', error);

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
};