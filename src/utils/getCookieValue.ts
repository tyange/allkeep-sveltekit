export const getCookieValue = (cookieName: string) => {
	// 모든 쿠키를 세미콜론으로 분리
	const cookies = document.cookie.split(';');

	// 각 쿠키를 순회하며 목표 쿠키를 찾음
	for (let i = 0; i < cookies.length; i++) {
		// 현재 쿠키를 잘라서 key와 value로 나눔
		const cookie = cookies[i].trim();
		const [key, value] = cookie.split('=');

		// key가 목표 쿠키 이름과 같으면 해당 값을 반환
		if (key === cookieName) {
			return decodeURIComponent(value);
		}
	}

	// 목표 쿠키를 찾지 못한 경우 null 반환
	return null;
};
