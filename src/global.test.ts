import {
	Component,
	createComponent,
	createEntity,
	getProps,
	search,
	createQuery,
	addComponent,
	Not,
	setProps,
	useSystem,
	hasComponent,
} from './global';
import { createSystem } from './core';

interface Vector {
	x: number;
	y: number;
}

beforeEach(() => {
	const system = createSystem();
	useSystem(system);
});

test('get props by component', () => {
	const Position = createComponent<Vector>();
	const pos = { x: 1, y: 2 };
	const entity = createEntity();

	addComponent(entity, Position, pos);

	expect(getProps(entity, Position)).toEqual(pos);
});

test('change props', () => {
	const Position = createComponent<Vector>();
	const pos = { x: 1, y: 2 };
	const entity = createEntity();

	setProps(entity, Position, {
		x: 2,
		y: 2,
	});

	expect(getProps(entity, Position)).toEqual({
		x: 2,
		y: 2,
	});
});

test('search components', () => {
	let LastComponent: Component<number>;
	let query: string;
	for (let c = 0; c < 10; c++) {
		const component = createComponent<number>();

		if (c == 9) {
			LastComponent = component;
			query = createQuery([LastComponent]);
		}

		for (let e = 0; e < c; e++) {
			const entity = createEntity();
			addComponent(entity, component, c);
		}
	}

	expect([...search(query)].length).toBe(9);

	for (const entity of search(query)) {
		const val = getProps(entity, LastComponent);

		expect(typeof val).toBe('number');
	}
});

test('search components without a component', () => {
	const Odd = createComponent<number>();
	const Even = createComponent<number>();
	for (let c = 0; c < 10; c++) {
		const entity = createEntity();
		const remainder = c % 2;
		if (remainder == 0) {
			addComponent(entity, Even, remainder);
		} else {
			addComponent(entity, Odd, remainder);
		}
	}

	const notOddQuery = createQuery([Not(Odd)]);
	const notEvenQuery = createQuery([Not(Even)]);

	expect([...search(notOddQuery)].length).toBe(5);
	expect([...search(notEvenQuery)].length).toBe(5);

	for (const entity of search(notOddQuery)) {
		if (hasComponent(entity, Even)) {
			const remainder = getProps(entity, Even);

			expect(remainder).toBe(0);
		}
	}

	for (const entity of search(notEvenQuery)) {
		if (hasComponent(entity, Odd)) {
			const remainder = getProps(entity, Odd);

			expect(remainder).not.toBe(0);
		}
	}
});
