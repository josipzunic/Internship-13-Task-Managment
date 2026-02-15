export function formatDate(val) {
    if (!val) return "";
    return new Date(val).toISOString().slice(0, 10);
}
