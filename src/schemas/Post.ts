import { Document, Schema, Model, model } from "mongoose";
import { ObjectID } from "bson";
import { IUserSchema } from "./User";
import * as moment from "moment";
import axios from "axios";
import "moment-timezone";
import { StatusError } from "../modules/Send-Rule";
import { Translate } from "@google-cloud/translate";
moment.tz.setDefault("Asia/Seoul");
moment.locale("ko");

/**
 * @description Post 요구 데이터
 */
export interface IPost {
	owner?: ObjectID;
	title: string;
	content: string;
	emotion: string;
	emotionScore: number;
	imgPath?: string;
	timeString?: string;
	createAt?: Date;
}
/**
 * @description Post 스키마에 대한 메서드 ( 레코드 )
 */
export interface IPostSchema extends IPost, Document {
	/**
	 * @description 이 글을 삭제합니다.
	 * @returns {Promise<boolean>} 성공 여부를 반환합니다.
	 */
	removePost(): Promise<any>;
	/**
	 * @description 이 글의 정보를 반환합니다.
	 * @param {IUser}data 글의 바꿀 정보
	 * @returns {Promise<IPostSchema>} 작업이 완료된 후 그 글를 반환합니다.
	 */
	changeInfomation(data: IPost): Promise<IPostSchema>;
	/**
	 * @description 이 글의 주인인지 아닌지를 판단합니다
	 * @param owner 비교할 주인
	 * @returns {boolean} 주인 여부를 반환합니다
	 */
	ownerCheck(owner: IUserSchema): boolean;
	getLastTime(): string;
	emotionAnalysis(): Promise<IUserSchema>;
}
/**
 * @description Post 모델에 대한 정적 메서드 ( 테이블 )
 */
export interface IPostModel extends Model<IPostSchema> {
	/**
	 * @description title과 content 필드의 유효성을 검사합니다.
	 * @param {any}data 체크 할 객체
	 * @returns {boolean} 유효성 결과
	 */
	dataCheck(data: any): boolean;
	/**
	 * @description 글을 생성한 후 그 글를 반환합니다.
	 * @param {IUser}data 생성할 글 데이터
	 * @returns {Promise<IUserSchema>} 입력받은 데이터에 대한 글입니다.
	 */
	createPost(owner: IUserSchema, data: IPost): Promise<IPostSchema>;
	/**
	 * @description 글의 아이디을 입력받아 일치하는 글를 반환합니다.
	 * @param {ObjectID}id 찾을 글의 _id(ObjectID)
	 * @returns {Promise<IPostSchema>} 일치하는 글를 반환합니다.
	 */
	findByID(id: ObjectID): Promise<IPostSchema>;
	/**
	 * @description 글의 주인을 입력받아 일치하는 글를 반환합니다.
	 * @param {IUserSchema}owner 찾을 글의 주인
	 * @returns {Promise<IPostSchema>} 일치하는 글를 반환합니다.
	 */
	findByOwner(owner: IUserSchema): Promise<IPostSchema[]>;
}

const PostSchema: Schema = new Schema({
	owner: { type: ObjectID, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	emotion: { type: String },
	emotionScore: { type: Number },
	imgPath: { type: String },
	timeString: { type: String },
	createAt: { type: Date, default: Date.now }
});

PostSchema.methods.removePost = function(this: IPostSchema): Promise<any> {
	return this.remove();
};
PostSchema.methods.changeInfomation = function(this: IPostSchema, data: IPost): Promise<IPostSchema> {
	Object.keys(data).forEach(x => {
		if (x in this && (x != "owner" && x != "createAt" && x != "_id")) this[x] = data[x] || this[x];
	});
	return this.save();
};
PostSchema.methods.ownerCheck = function(this: IPostSchema, data: IUserSchema): boolean {
	return data._id.equals(this.owner);
};
PostSchema.methods.getLastTime = function(this: IPostSchema): string {
	return moment(this.createAt)
		.startOf()
		.fromNow();
};

PostSchema.methods.emotionAnalysis = function(this: IPostSchema): Promise<IPostSchema> {
	return new Promise<IPostSchema>((resolve, reject) => {
		let translate = new Translate({ projectId: "calcium-ratio-249108", key: process.env.GCP_APIKEY });
		translate
			.translate(this.content, "en")
			.then(translateContent => {
				axios
					.post(
						"https://stac.cognitiveservices.azure.com/text/analytics/v2.1/sentiment",
						{ documents: [{ language: "en", id: "1", text: translateContent[0] }] },
						{
							headers: {
								"Ocp-Apim-Subscription-Key": process.env.MS_APIKEY
							}
						}
					)
					.then(data => {
						let score = parseFloat(data.data.documents[0].score);
						if (score != NaN) {
							this.emotionScore = score;
							this.save()
								.then(post => {
									resolve(post);
								})
								.catch(err => reject(err));
						} else {
							reject(new StatusError(500, "데이터 변환 중 에러"));
						}
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};

PostSchema.statics.dataCheck = function(this: IPostSchema, data: any): boolean {
	return "title" in data && "content" in data;
};
PostSchema.statics.createPost = function(this: IPostModel, owner: IUserSchema, data: IPost): Promise<IPostSchema> {
	data.owner = owner._id;
	data.emotionScore = -1;
	let post = new this(data);
	return new Promise((resolve, reject) => {
		post.save()
			.then((data: IPostSchema) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};
PostSchema.statics.findByID = function(this: IPostModel, id: ObjectID): Promise<IPostSchema> {
	return new Promise((resolve, reject) => {
		this.findOne({ _id: id })
			.then((data: IPostSchema) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};
PostSchema.statics.findByOwner = function(this: IPostModel, owner: IUserSchema): Promise<IPostSchema[]> {
	return new Promise((resolve, reject) => {
		this.find({ owner: owner._id })
			.then((data: IPostSchema[]) => {
				resolve(data);
			})
			.catch(err => reject(err));
	});
};

export default model<IPostSchema>("Post", PostSchema) as IPostModel;
