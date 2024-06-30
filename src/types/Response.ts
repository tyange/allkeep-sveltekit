export type ResponseData<T extends Record<string, unknown>> = {
	message: string;
} & T;
