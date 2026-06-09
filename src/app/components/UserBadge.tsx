interface UserBadgeProps {
  role: string;
  color?: string; // Hex color
  className?: string;
}

const UserBadge = ({ role, color, className = '' }: UserBadgeProps) => {
  // Helper to calculate background and text colors from a base hex color
  // This is a simplified version. For production, use a library like 'tinycolor2'
  // or stick to the dynamic style logic if color is provided.
  
  const getDynamicStyle = (baseColor: string) => {
    // We'll use inline styles for custom colors since Tailwind classes are predefined
    return {
      borderColor: baseColor,
      backgroundColor: `${baseColor}20`, // 20 = ~12% opacity
      color: baseColor
    };
  };

  // Fallback for hardcoded/legacy roles if no color provided
  const getFallbackStyles = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Tutor':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Estudante':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  if (color) {
    const style = getDynamicStyle(color);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium border ${className}`}
        style={style}
      >
        {role}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium border ${getFallbackStyles(role)} ${className}`}
    >
      {role}
    </span>
  );
};

export default UserBadge;
