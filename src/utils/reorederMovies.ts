export function moveItem<T>(arr: T[], from: number, to: number): T[] {
    const updated = [...arr];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
}