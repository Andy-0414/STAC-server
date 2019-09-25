import { Request, Response, NextFunction } from "express";
import axios from "axios";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";

/**
 * @description 뇌파를 이용해 감정을 가져오는 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetEmotion = function(req: Request, res: Response, next: NextFunction) {
	let data = req.body.data;
	if (data) {
		let sendData = [];
		let len = data[Object.keys(data)[0]].length;
		for (let i = 0; i < len; i++) {
			let tmp = [];
			Object.keys(data).forEach(x => {
				tmp.push(data[x][i]);
			});
			sendData.push(tmp);
        }
		if (len == 30) {
			axios
				.post("http://35.200.96.46:8000/", { data: sendData })
				.then(data => {
					SendRule.response(res, HTTPRequestCode.OK, data.data);
				})
				.catch(err => next(err));
		} else {
			next(new StatusError(HTTPRequestCode.BAD_REQUEST, "요청 갯수가 잘못됨"));
		}
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
