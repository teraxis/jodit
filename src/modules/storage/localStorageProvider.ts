/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { BooleanFunction, IStorage, StorageValueType } from '../../types';

/**
 * Check if user disable local storages/cookie etc.
 */
export const canUsePersistentStorage: BooleanFunction = (() => {
	const canUse = () => {
		const tmpKey = '___Jodit___' + Math.random().toString();

		try {
			localStorage.setItem(tmpKey, '1');
			const result = localStorage.getItem(tmpKey) === '1';
			localStorage.removeItem(tmpKey);

			return result;
		} catch {}

		return false;
	};

	let result: boolean | undefined;

	return () => {
		if (result === undefined) {
			result = canUse();
		}

		return result;
	};
})();

/**
 * Persistent storage in localStorage
 */
export class LocalStorageProvider<T = StorageValueType> implements IStorage<T> {
	set(key: string, value: T) {
		try {
			const buffer = localStorage.getItem(this.rootKey);

			const json = buffer ? JSON.parse(buffer) : {};

			json[key] = value;

			localStorage.setItem(this.rootKey, JSON.stringify(json));
		} catch {}
	}

	get<R = T>(key: string): R | void {
		try {
			const buffer = localStorage.getItem(this.rootKey);

			const json = buffer ? JSON.parse(buffer) : {};

			return json[key] !== undefined ? json[key] : null;
		} catch {}
	}

	exists(key: string): boolean {
		return this.get(key) !== null;
	}

	constructor(readonly rootKey: string) {}

	clear(): void {
		try {
			localStorage.removeItem(this.rootKey);
		} catch {}
	}
}
