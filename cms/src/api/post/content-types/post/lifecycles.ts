function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (data.content && typeof data.content === 'string') {
      data.readingTime = estimateReadingTime(data.content);
    }
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (data.content && typeof data.content === 'string') {
      data.readingTime = estimateReadingTime(data.content);
    }
  },
};
