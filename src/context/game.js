/* eslint-disable default-case */
import React, { useReducer } from 'react';

export const GameContext = React.createContext();

const difficultiesLib = {
	EASY: 'EASY',
	MEDIUM: 'MEDIUM',
	HARD: 'HARD',
	EXPERT: 'EXPERT',
	JEDI: 'JEDI',
};

const hintsLib = {
	EASY: 5,
	MEDIUM: 10,
	HARD: 15,
	EXPERT: 20,
	JEDI: 0,
};

const guessesLib = {
	EASY: 5,
	MEDIUM: 4,
	HARD: 3,
	EXPERT: 2,
	JEDI: 1,
};

const progressesLib = {
	PLAYING: 'PLAYING',
	WON: 'WON',
	LOST: 'LOST',
};

const playerMessagesLib = {
	YOU_WIN: 'You Win!',
	ALREADY_GUESSED: 'You have already guessed that number.',
	YOU_LOSE: 'You Lose :(',
	BURNING_UP: "You're burning up!",
	LUKEWARM: "You're lukewarm.",
	BIT_CHILLY: "You're a bit chilly.",
	ICE_COLD: "You're ice cold!",
	JEDI_HINT: 'Reach out with your feelings ...',
	CLEAR_MESSAGE: '',
	START_MESSAGE: 'Good luck!',
	NOT_ENOUGH_GUESSES_LEFT: 'Not enough guesses left to hint...go for it!',
	PLEASE_CHOOSE_A_SQUARE: 'Select a square and resubmit!',
};

const initState = {
	difficulty: 'EASY',
	pastGuesses: [],
	winningNumber: Math.ceil(Math.random() * 100),
	currentHints: [],
	maxGuesses: 5,
	numHints: 5,
	selectedSquare: 0,
	currentProgress: progressesLib.PLAYING,
	playerMessage: playerMessagesLib.START_MESSAGE,
	currentWinstreak: 0,
};

const LOAD_GAME = 'LOAD_GAME';
const START_GAME = 'START_GAME';
const PLAYER_GUESSED = 'PLAYER_GUESSED';
const PLAYER_REQUESTED_HINT = 'PLAYER_REQUESTED_HINT';
const SELECT_NEW_SQUARE = 'SELECT_NEW_SQUARE';

const getPlayerMessage = (guess, winner) => {
	if (guess === winner) return playerMessagesLib.YOU_WIN;

	const diff = Math.abs(guess - winner);

	switch (true) {
		case diff < 10:
			return playerMessagesLib.BURNING_UP;
		case diff < 25:
			return playerMessagesLib.LUKEWARM;
		case diff < 50:
			return playerMessagesLib.BIT_CHILLY;
		case diff < 100:
			return playerMessagesLib.ICE_COLD;
	}
};

const getNewHints = (level, winner) => {
	let res = [];

	const generateHint = () => Math.ceil(Math.random() * 100);

	while (res.length < level - 1) {
		let hint = generateHint();
		while (res.includes(hint)) hint = generateHint();

		res.push(hint);
	}

	res.push(winner);

	return res;
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case LOAD_GAME: {
			return {
				...state,
				currentWinstreak: +payload.winstreak || 0,
			};
		}

		// payload: { difficulty: /* the current difficulty constant */}
		case START_GAME: {
			return {
				...initState,
				difficulty: payload.difficulty,
				winningNumber: Math.ceil(Math.random() * 100),
				maxGuesses: guessesLib[payload.difficulty],
				numHints: hintsLib[payload.difficulty],
				currentProgress: progressesLib.PLAYING,
				currentWinstreak: state.currentWinstreak,
			};
		}

		case SELECT_NEW_SQUARE: {
			return {
				...state,
				currentHints: [],
				selectedSquare: payload.selectedSquare,
			};
		}

		case PLAYER_GUESSED: {
			// if player has not selected a square before clicking submit guess btn
			if (!payload.selectedSquare)
				return {
					...state,
					currentHints: [],
					playerMessage: playerMessagesLib.PLEASE_CHOOSE_A_SQUARE,
				};

			// if player has already made that guess
			if (state.pastGuesses.includes(payload.selectedSquare))
				return {
					...state,
					playerMessage: playerMessagesLib.ALREADY_GUESSED,
				};

			// if player has won
			if (payload.selectedSquare === state.winningNumber) {
				const newState = {
					...state,
					currentProgress: progressesLib.WON,
					playerMessage: playerMessagesLib.YOU_WIN,
					currentWinstreak: state.currentWinstreak++,
				};

				return newState;
			}

			// otherwise process
			const newState = {
				...state,
				pastGuesses: [...state.pastGuesses, payload.selectedSquare],
				playerMessage: getPlayerMessage(
					payload.selectedSquare,
					state.winningNumber
				),
			};

			// if lost
			if (newState.pastGuesses.length === newState.maxGuesses) {
				localStorage.setItem('winstreak', '0');

				return {
					...newState,
					currentProgress: progressesLib.LOST,
					playerMessage: playerMessagesLib.YOU_LOSE,
					currentWinstreak: 0,
				};
			}

			// otherwise, keep playing
			return newState;
		}

		case PLAYER_REQUESTED_HINT: {
			// if player is jedi
			if (state.difficulty === difficultiesLib.JEDI) {
				return {
					...state,
					playerMessage: playerMessagesLib.JEDI_HINT,
				};
			}

			// if player has no hints left
			if (state.maxGuesses - state.pastGuesses.length === 1) {
				return {
					...state,
					playerMessage: playerMessagesLib.NOT_ENOUGH_GUESSES_LEFT,
				};
			}

			// otherwise, get new hints
			return {
				...state,
				currentHints: getNewHints(
					hintsLib[state.difficulty],
					state.winningNumber
				),
				playerMessage: playerMessagesLib.CLEAR_MESSAGE,
				pastGuesses: [...state.pastGuesses, null],
			};
		}

		default:
			return state;
	}
};

const GameProvider = ({ children }) => {
	// useReducer takes initState as an arg
	// rather than the redux convention of setting default state
	// as a rest parameter on the reducer function itself
	const [state, dispatch] = useReducer(reducer, initState);

	const providerValue = {
		state,
		dispatch,
		difficultiesLib,
		progressesLib,
		LOAD_GAME,
		PLAYER_GUESSED,
		PLAYER_REQUESTED_HINT,
		START_GAME,
		SELECT_NEW_SQUARE,
	};

	return (
		<GameContext.Provider value={providerValue}>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
