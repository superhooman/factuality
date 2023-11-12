export const Favicon: React.FC<{ url: string, size?: number }> = ({ url, size = 16 }) => {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${url}&sz=256`}
      alt={`Favicon for ${url}`}
      width={size}
      height={size}
      style={{ borderRadius: 6 }}
    />
  );
};
