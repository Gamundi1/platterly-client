const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#0396D6',
  '#009688',
  '#43A047',
  '#689F38',
  '#C79100',
  '#E07B00',
  '#FF5722',
  '#795548',
  '#607D8B',
];

export function getUserAvatarColor(name: string): string {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
