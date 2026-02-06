import '../styles/CategoryBadge.css';

const CategoryBadge = ({ category, children, className = '' }) => {
  const getCategoryClass = (cat) => {
    const catLower = cat?.toString().toLowerCase();
    
    if (['a', 'high', 'premium', 'urgent'].includes(catLower)) return 'category-a';
    if (['b', 'medium', 'standard', 'normal'].includes(catLower)) return 'category-b';
    if (['c', 'low', 'basic', 'regular'].includes(catLower)) return 'category-c';
    
    return 'category-default';
  };

  const categoryClass = getCategoryClass(category);
  
  return (
    <span className={`category-badge ${categoryClass} ${className}`}>
      {children || category || 'N/A'}
    </span>
  );
};

export default CategoryBadge;
