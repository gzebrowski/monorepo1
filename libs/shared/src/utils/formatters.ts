import { DateTime } from 'luxon';

export function splitCamelCaseWords(str: string, titleCase: boolean = false): string {
	const result = str
		.replace(/([a-z]+)([A-Z]+)/g, '$1 $2')
		.split(' ')
		.filter((word) => word.length > 0)
		.map((word) => word.toLowerCase());
	if (!result.length) {
		return '';
	}
	return titleCase ? (result.map((word) => word.charAt(0).toUpperCase() + word.slice(1))).join(' ') : result.join(' ');
}

export function splitKebabCaseWords(str: string, titleCase: boolean = false): string {
	const result = str
		.replace(/-/g, ' ')
		.split(' ')
		.filter((word) => word.length > 0)
		.map((word) => word.toLowerCase());
	if (!result.length) {
		return '';
	}
	return titleCase ? (result.map((word) => word.charAt(0).toUpperCase() + word.slice(1))).join(' ') : result.join(' ');
}

export function splitSnakeCaseWords(str: string, titleCase: boolean = false): string {
	const result = str
		.replace(/[_]+/g, ' ')
		.split(' ')
		.filter((word) => word.length > 0)
		.map((word) => word.toLowerCase());
	if (!result.length) {
		return '';
	}
	return titleCase ? (result.map((word) => word.charAt(0).toUpperCase() + word.slice(1))).join(' ') : result.join(' ');
}
