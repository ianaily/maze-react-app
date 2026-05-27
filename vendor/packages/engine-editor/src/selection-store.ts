export class SelectionStore {
  private readonly selectedIds = new Set<string>();

  get size(): number {
    return this.selectedIds.size;
  }

  selectOnly(id: string): void {
    this.selectedIds.clear();
    this.selectedIds.add(id);
  }

  add(id: string): void {
    this.selectedIds.add(id);
  }

  remove(id: string): void {
    this.selectedIds.delete(id);
  }

  toggle(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      return;
    }

    this.selectedIds.add(id);
  }

  clear(): void {
    this.selectedIds.clear();
  }

  has(id: string): boolean {
    return this.selectedIds.has(id);
  }

  list(): readonly string[] {
    return [...this.selectedIds];
  }

  retain(existingIds: ReadonlySet<string>): void {
    for (const id of this.selectedIds) {
      if (!existingIds.has(id)) {
        this.selectedIds.delete(id);
      }
    }
  }
}
