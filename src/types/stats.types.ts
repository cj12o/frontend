export type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

export type StatsBarProps = {
  stats?: HomePageStats;
};
