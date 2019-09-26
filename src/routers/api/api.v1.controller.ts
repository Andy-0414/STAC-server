import { Request, Response, NextFunction } from "express";
import axios from "axios";
import SendRule, { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schemas/User";

/**
 * @description 뇌파를 이용해 감정을 가져오는 라우터입니다.
 * @param {Request}req Express req
 * @param {Response}res Express res
 * @param {NextFunction}next Express next
 */
export const GetEmotion = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
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
					let result = data.data as number;
					user.brainWaveDatas.push(result);
					user.save()
						.then(user => {
							SendRule.response(res, HTTPRequestCode.OK, result);
						})
						.catch(err => next(err));
				})
				.catch(err => next(err));
		} else {
			next(new StatusError(HTTPRequestCode.BAD_REQUEST, "요청 갯수가 잘못됨"));
		}
	} else {
		next(new StatusError(HTTPRequestCode.BAD_REQUEST, "잘못된 요청"));
	}
};
export const GetEmotionCount = function(req: Request, res: Response, next: NextFunction) {
	let user = req.user as IUserSchema;
	let result = [0, 0, 0];
	user.brainWaveDatas.forEach(x => {
		result[x]++;
	});
	SendRule.response(res, HTTPRequestCode.OK, result);
};
