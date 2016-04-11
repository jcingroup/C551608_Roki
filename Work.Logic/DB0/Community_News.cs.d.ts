declare module server {
	interface Community_News {
		community_news_id: number;
		community_id: number;
		title: string;
		context: string;
		start_date: Date;
		end_date: Date;
		state: string;
		community: {
		};
	}
}
