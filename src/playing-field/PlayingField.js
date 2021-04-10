import React, { useContext } from 'react';
import { GameContext } from '../context/game';

const Row = ({ scalar }) => {
	const { state, dispatch, progressesLib, SELECT_NEW_SQUARE } = useContext(
		GameContext
	);

	const pattern = () => {
		return (scalar / 10) % 2 === 0
			? ['darkSquare', 'lightSquare']
			: ['lightSquare', 'darkSquare'];
	};

	return (
		<div className='row'>
			{new Array(10).fill(null).map((empty, idx) => {
				const [evenSquare, oddSquare] = pattern();

				const squareValue = idx + 1 + scalar;

				const getClassName = () => {
					const squareType = idx % 2 === 0 ? evenSquare : oddSquare;

					const modifier = (() => {
						const won =
							state.currentProgress === progressesLib.WON &&
							squareValue === state.winningNumber;

						const lost =
							state.currentProgress === progressesLib.LOST &&
							squareValue === state.winningNumber;

						const currentChoice =
							state.selectedSquare === squareValue &&
							state.currentProgress === progressesLib.PLAYING;

						const hint = state.currentHints.includes(squareValue);

						switch (true) {
							case won:
								return ' won';
							case lost:
								return ' lost';
							case currentChoice:
								return ' currentChoice';
							case hint:
								return ' hint';
							default:
								return '';
						}
					})();

					return squareType + modifier;
				};

				return (
					<span
						key={idx}
						className={getClassName()}
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
	const { state, dispatch, LOAD_GAME } = useContext(GameContext);

	window.onload = () => {
		const winstreak = +localStorage.getItem('winstreak') || 0;

		dispatch({
			type: LOAD_GAME,
			payload: {
				winstreak,
			},
		});
	};

	window.onunload = () => {
		localStorage.setItem('winstreak', state.currentWinstreak);
	};

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
