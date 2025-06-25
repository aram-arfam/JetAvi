// backend/utils/formatters.js

const safeGet = (obj, path, fallback = "---") => {
    if (!path) return fallback;
    return path.split(".").reduce((acc, part) => {
        return acc && acc[part] != null ? acc[part] : fallback;
    }, obj) ?? fallback;
};

const formatDimensions = (piece) => {
    const l = safeGet(piece, 'length', '-');
    const w = safeGet(piece, 'width', '-');
    const h = safeGet(piece, 'height', '-');
    if (l === '-' || w === '-' || h === '-') return '---';
    return `${l}x${w}x${h} cm`;
};

const formatNumber = (value, decimals = 2, fallback = '---') => {
    const num = Number(value);
    return isNaN(num) ? fallback : num.toFixed(decimals);
};

const formatDate = (dateString, fallback = '---') => {
    if (!dateString) return fallback;
    const dateValue = typeof dateString === 'object' && dateString !== null && dateString.$date ? dateString.$date : dateString;
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            return fallback;
        }
        // Use a simple format like YYYY-MM-DD or MM/DD/YYYY for consistency
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
        // Or use date.toLocaleDateString() if server locale is reliable
    } catch (e) {
        return fallback;
    }
};

export { safeGet, formatDimensions, formatNumber, formatDate };