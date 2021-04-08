import React, { useContext } from 'react';
import { GameContext } from './context/game';

const Row = ({ scalar }) => {
	const { state, dispatch, SELECT_NEW_SQUARE } = useContext(GameContext);

	const pattern = () => {
		return (scalar / 10) % 2 === 0
			? ['lightSquare', 'darkSquare']
			: ['darkSquare', 'lightSquare'];
	};

	return (
		<div className='row'>
			{new Array(10).fill(null).map((empty, idx) => {
				const [oddSquare, evenSquare] = pattern();

				const squareValue = idx + 1 + scalar;

				return (
					<span
						key={idx}
						className={
							(idx % 2 === 0 ? oddSquare : evenSquare) +
							(state.selectedSquare === squareValue
								? ' currentChoice'
								: '')
						}
						onClick={e => {
							dispatch({
								type: SELECT_NEW_SQUARE,
								payload: {
									selectedSquare: +e.target.innerText,
								},
							});
						}}
					>
						{squareValue}
					</span>
				);
			})}
		</div>
	);
};

const PlayingField = () => {
	const scalars = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

	return (
		<div className='playing-field'>
			{scalars.map(scalar => (
				<Row key={scalar} scalar={scalar} />
			))}
		</div>
	);
};

export default PlayingField;
