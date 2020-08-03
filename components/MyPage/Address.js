import React from "react";
import DaumPostcode from "react-daum-postcode";

const Postcode = (props) => {
	const handleComplete = (data) => {
		console.log("handleComplete", data);
		let fullAddress = data.address;
		let extraAddress = "";

		if (data.addressType === "R") {
			if (data.bname !== "") {
				extraAddress += data.bname;
			}
			if (data.buildingName !== "") {
				extraAddress +=
					extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
			}
			fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
		}
		props.onComplete(fullAddress, data.zonecode);
	};

	return (
		<div style={{ height: "100%" }}>
			<DaumPostcode onComplete={handleComplete} height={"450px"} />
			<style jsx>{`
                .adrs-close-btn {
                    display: inline-block;
                    float: right;
                    z-index: 2;
                    position: relative;
                    top: 24px;
                }
                .adrs-close-btn:hover {
                    cursor: pointer;
                }
            `}</style>
		</div>
	);
};
export default Postcode;
