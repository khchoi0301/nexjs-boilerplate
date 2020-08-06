import { toast } from "react-toastify";

export const regExpTest = (str) => {
	const regExp = /[\{\}\[\]\/?,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/g;
	console.log("특수문자", str.match(regExp));
	return regExp.test(str);
};

export const userNameCheck = (name) => {
	const specialSymbols = regExpTest(name);
	const characterLength = name.length >= 2 && name.length <= 30;
	const firstCharacter = (/[^.|_]/g).test(name[0]);
	const lastCharacter = (/[^.|_]/g).test(name[name.length - 1]);

	if (specialSymbols) {
		return "특수문자는 .와 _만 사용 가능합니다";
	}

	if (!characterLength) {
		return "2자 이상 30자 이하 설정해 주세요";
	}

	if (!firstCharacter || !lastCharacter) {
		return "특수 문자는 이름 중간에만 사용 할 수 있습니다.";
	}

	return false;
};

export const openToast = ({ type = "success", msg = "변경 사항이 적용되었습니다!" }) => {
	console.log("openToast", type, msg);
	toast[type](`🦄 ${msg}`, {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined
	});
};
