import { Response } from 'node-fetch';

import fetch from './util/fetch-wrapper';
import { baseUrl, token } from './util/config';
import qsEncode from './util/qs-encode';

export interface IDeployUnit {
	name: string;
	version: string;
	platform: string;
	model: string;

	id?: number;
	namespace?: string;
	tdefName?: string;
	tdefVersion?: number;
}

export default {
	all() {
		return fetch<IDeployUnit[]>(`${baseUrl()}/api/dus`);
	},

	get(id: number) {
		return fetch<IDeployUnit>(`${baseUrl()}/api/dus/${id}`);
	},

	getAllByNamespaceAndTdefName(namespace: string, tdefName: string) {
		return fetch<IDeployUnit[]>(`${baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/dus`);
	},

	getAllByNamespaceAndTdefNameAndTdefVersion(namespace: string, tdefName: string, tdefVersion: number) {
		return fetch<IDeployUnit[]>(`${baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus`);
	},

	getSpecificByNamespaceAndTdefNameAndTdefVersion(namespace: string, tdefName: string, tdefVersion: number, filters: { [key:string]: string }) {
		return fetch<IDeployUnit[]>(`${baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/specific-dus?${qsEncode(filters)}`);
	},

	create(namespace: string, tdefName: string, tdefVersion: number, du: IDeployUnit) {
		return fetch<IDeployUnit>(`${baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token()}`
			},
			body: JSON.stringify(du)
		});
	},

	delete(id: number): Promise<Response> {
		return fetch(`${baseUrl()}/api/dus/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token()}`
			}
		});
	},

	deleteByNamespaceAndTdefNameAndTdefVersionAndNameAndVersionAndPlatform(namespace: string, tdefName: string, tdefVersion: number, name: string, version: string, platform: string) {
		return fetch(`${baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus/${name}/${version}/${platform}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token()}`
			}
		});
	}
};
