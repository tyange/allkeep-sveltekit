export type Work = {
	id: number;
	company_id: number;
	company_name: string;
	working_time: number;
	start_at: string | null;
	done_at: string | null;
	pause_at: string | null;
	is_pause: boolean;
	is_done: boolean;
	user_id: number;
};
