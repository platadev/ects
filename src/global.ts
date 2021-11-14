import type { System as Core_System, Component, Query } from './core';
import {
	createQuery as Core_createQuery,
	createSystem as Core_createSystem,
	addComponent as Core_addComponent,
	createComponent as Core_createComponent,
	createEntity as Core_createEntity,
	getProps as Core_getProps,
	hasComponent as Core_hasComponent,
	search as Core_search,
	setProps as Core_setProps,
	Not as Core_Not,
} from './core';

export let system = Core_createSystem();

/**
 * @category Global
 * @param sys The system to be use
 */
export function useSystem(sys: Core_System) {
	system = sys;
}

/**
 * @category Global
 */
export function createComponent<T>() {
	return Core_createComponent<T>(system);
}

/**
 * @category Global
 */
export function hasComponent<T>(entityId: string, component: Component<T>) {
	return Core_hasComponent<T>(system, entityId, component);
}

/**
 * @category Global
 */
export function createEntity<T>() {
	return Core_createEntity(system);
}

/**
 * @category Global
 */
export function createQuery(queries: Query[]) {
	return Core_createQuery(system, queries);
}

/**
 * @category Global
 */
export function addComponent<T>(
	entityId: string,
	component: Component<T>,
	data: T,
) {
	Core_addComponent(system, entityId, component, data);
}

/**
 * @category Global
 */
export function getProps<T>(entityId: string, component: Component<T>): T {
	return Core_getProps(system, entityId, component);
}

/**
 * @category Global
 */
export function setProps<T>(
	entityId: string,
	component: Component<T>,
	data: T,
) {
	Core_setProps(system, entityId, component, data);
}

/**
 * @category Global
 */
export function search(query: string): Generator<string> {
	return Core_search(system, query);
}

export function Not<T>(component: Component<T>) {
	return Core_Not(system, component);
}

export { createSystem, Component } from './core';
