export const generateImageUrl = (name: string): string => {
  const bgColors = ["2a9d8f", "e9c46a", "f4a261", "e76f51", "264653"];
  const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${randomBgColor}&color=ffffff&size=200&rounded=true`;
};
