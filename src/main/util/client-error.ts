import { Response } from 'node-fetch';

export default class KevoreeRegistryClientError extends Error {

	public name: string;
	public response: Response;

	constructor(response: Response, detail?: string) {
		super(response.status + ' - ' + response.statusText + (detail ? detail : ''));
		(<any> Object).setPrototypeOf(this, KevoreeRegistryClientError.prototype);
		this.name = 'KevoreeRegistryClientError';
		this.response = response;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error()).stack;
		}
	}
}