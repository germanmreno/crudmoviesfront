export default function Avatar({ name, size = 48, avatarUrl = null }) {
  // Si hay un avatarUrl, lo usamos
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          backgroundColor: '#eee',
          display: 'block'
        }}
      />
    );
  }

  // Si no hay avatar, generamos uno por defecto con Dicebear
  const defaultAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=${size}&backgroundColor=random`;

  return (
    <img
      src={defaultAvatarUrl}
      alt={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'block'
      }}
    />
  );
} 