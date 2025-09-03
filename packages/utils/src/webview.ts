export const getIsWebview = () => {
  const userAgent = navigator.userAgent;

  const isIOSWebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    userAgent
  );
  const isAndroidWebview =
    /wv/.test(userAgent) ||
    /Android.*Version\/[0-9\.]+.*Chrome\/[0-9\.]+ Mobile/i.test(userAgent);

  return isIOSWebview || isAndroidWebview;
};
