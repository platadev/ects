# ECTS

> A small, fast and functional ecs library written in typescript

## Installation

```bash
  npm install @plata/ects
  # or
  yarn add @plata/ects
```

## Usage

```typescript
import {
	createComponent,
	createEntity,
	getProps,
	search,
	createQuery,
	Not,
	addComponent,
} from '@plata/ects';

interface Vector {
	x: number;
	y: number;
}

const Position = createComponent<Vector>();
const entity1 = createEntity();
const entity2 = createEntity();

addComponent(entity1, position, { x: 1, y: 2 });

const pos = getProps(entity1, position);

const query1 = createQuery(Position);
const query1 = createQuery([Not(Position)]);

for (const entity of search(query1)) {
	// entities with position
}

for (const entity of search(query2)) {
	// entities without position
}
```

## Feedback

If you have any feedback, please reach out to me at [@albzrs](https://twitter.com/albzrs)

## License

[MIT](https://choosealicense.com/licenses/mit/)
