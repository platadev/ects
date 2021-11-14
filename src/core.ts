import invariant from 'invariant';

export interface Component<T> {
	id: string;
}

export type Query = ReturnType<typeof Not> | Component<unknown>;

export type EmptyMap = Record<string, undefined>;

export interface System {
	entities: string[];
	components: Record<string, EmptyMap>;
	queries: {
		map: Record<string, Query[]>;
		list: string[];
	};
	props: Record<string, unknown>;
	queryKeys: Record<string, string[]>;
}

const idFactory = (prefix: string) => {
	let counter = 0;
	const createId = () => {
		const id = `${prefix}${counter}`;
		counter += 1;
		return id;
	};

	return createId;
};

const createComponentId = idFactory('c');
const createEntityId = idFactory('e');
const createQueryId = idFactory('q');

export const createSystem = (): System => {
	return {
		entities: [],
		components: {
			map: {},
		},
		queries: {
			map: {},
			list: [],
		},
		props: {},
		queryKeys: {},
	};
};

export const createComponent = <T>(system: System): Component<T> => {
	const id = createComponentId();
	const component: Component<T> = {
		id,
	};

	system.components[id] = {};

	return component;
};

export const createEntity = (system: System) => {
	const { entities } = system;
	const entityId = createEntityId();

	entities.push(entityId);

	return entityId;
};

const checkQueryById = (
	system: System,
	entityId: string,
	queryId: string,
): boolean => {
	const { components, queries } = system;

	invariant(queries.map[queryId], `Query '${queryId}' not found!`);
	const query = queries.map[queryId]!;

	for (let index = 0; index < query.length; index++) {
		const condition = query[index]!;

		if (typeof condition === 'function') {
			if (condition(entityId)) {
				continue;
			}
		} else {
			const map = components[condition.id];
			if (map && entityId in map) {
				continue;
			}
		}
		return false;
	}

	return true;
};

export const createQuery = (system: System, query: Query[]): string => {
	const { queries, entities, queryKeys } = system;
	const queryId = createQueryId();

	const queryKey: string[] = [];

	queries.map[queryId] = query;
	queries.list.push(queryId);

	for (let index = 0; index < entities.length; index++) {
		const entityId = entities[index]!;

		if (checkQueryById(system, entityId, queryId)) {
			queryKey.push(entityId);
		}
	}

	queryKeys[queryId] = queryKey;
	return queryId;
};

export function addComponent<T>(
	system: System,
	entityId: string,
	component: Component<T>,
	data: T,
) {
	const { components, props, queries, queryKeys } = system;

	invariant(components[component.id], `Component '${component.id}' not found!`);

	components[component.id]![entityId] = undefined;
	props[`${entityId}${component.id}`] = data;

	for (let index = 0; index < queries.list.length; index++) {
		const queryId = queries.list[index]!;
		if (checkQueryById(system, entityId, queryId)) {
			queryKeys[queryId]!.push(entityId);
		}
	}
}

export const getProps = <T>(
	system: System,
	entityId: string,
	component: Component<T>,
): T => {
	return system.props[`${entityId}${component.id}`] as T;
};

export const setProps = <T>(
	system: System,
	entityId: string,
	component: Component<T>,
	data: T,
) => {
	system.props[`${entityId}${component.id}`] = data;
};

export function hasComponent<T>(
	system: System,
	entityId: string,
	component: Component<T>,
) {
	const { components } = system;

	const byComponent = components[component.id];

	return byComponent && entityId in byComponent;
}

export const Not =
	<T>(system: System, component: Component<T>) =>
	(entityId: string) => {
		return !hasComponent(system, entityId, component);
	};

export function* search(system: System, queryId: string): Generator<string> {
	const { queryKeys } = system;

	invariant(queryKeys[queryId], `Query '${queryId}' not found!`);
	const queryKey = queryKeys[queryId]!;

	for (let index = 0; index < queryKey.length; index++) {
		const entityId = queryKey[index]!;

		yield entityId;
	}
}
