export function getLikePCT(likes: number, dislikes: number): number {
    return likes / (likes + dislikes);
}

export function formatLikePCT(likes: number, dislikes: number): string {
    const pct = getLikePCT(likes, dislikes);

    return (isNaN(pct) ? "100" : `${Math.round(pct * 100)}`) + '%';
}
