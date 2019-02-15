class NotFoundError extends Error {
	constructor() {
		super();
		this.message = '존재하지 않는 정보입니다.';
		this.status = 404;
	}
}

class WrongEntityError extends Error {
	constructor() {
		super();
		this.message = 'url에 유효하지 않은 값을 전달 받았습니다';
		this.status = 422;
	}
}

class GeneralServerError extends Error {
	constructor() {
		super();
		this.message = '시스템에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
		this.statue = 500;
	}
}

module.exports = {
	NotFoundError,
	WrongEntityError,
	GeneralServerError,
};
