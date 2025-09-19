export const routeAppPage = (page: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_APP_CLIENT_PROTOCOL}://${process.env.NEXT_PUBLIC_APP_CLIENT_HOST}${page}`;
};
