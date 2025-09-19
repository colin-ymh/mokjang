export const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

export const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}`;
export const TEST_SERVER_URL = `${process.env.NEXT_PUBLIC_TEST_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_TEST_SERVER_HOST}`;

export const LANDING_CLIENT_URL = `${process.env.NEXT_PUBLIC_LANDING_CLIENT_PROTOCOL}://${process.env.NEXT_PUBLIC_LANDING_CLIENT_HOST}:${process.env.NEXT_PUBLIC_LANDING_CLIENT_PORT}`;
export const APP_CLIENT_URL = `${process.env.NEXT_PUBLIC_APP_CLIENT_PROTOCOL}://${process.env.NEXT_PUBLIC_APP_CLIENT_HOST}:${process.env.NEXT_PUBLIC_APP_CLIENT_PORT}`;
