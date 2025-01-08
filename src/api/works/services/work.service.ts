import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DevWork } from "../schemas/devwork.schema";
import { LocalWork } from "../schemas/localwork.schema";
import { JcbWork } from "../schemas/jobwork.schema";
import { Model } from "mongoose";

@Injectable()
export class WorkService {

    constructor(
        @InjectModel(DevWork.name) private readonly DevWorkModel: Model<DevWork>,
        @InjectModel(LocalWork.name) private readonly LocalWorkModel: Model<LocalWork>,
        @InjectModel(JcbWork.name) private readonly JcbWorkModel: Model<JcbWork>,
    ) { }


    async getWorks(search: string, page: number, limit: number, workName: string) {
        try {
            const query: any = {};

            if (search) {
                query.$or = [
                    { pickPartyName: { $regex: search, $options: 'i' } },
                    { dropPartyName: { $regex: search, $options: 'i' } },
                    { material: { $regex: search, $options: 'i' } },
                ];

                if (workName === 'jcb') {
                    query.$or.push({ machineType: { $regex: search, $options: 'i' } });
                }
            }

            const skip = (page - 1) * limit;
            let model, totalWorks, works;

            switch (workName) {
                case 'dev':
                    model = this.DevWorkModel;
                    break;
                case 'local':
                    model = this.LocalWorkModel;
                    break;
                case 'jcb':
                    model = this.JcbWorkModel;
                    break;
                default:
                    throw new HttpException('Invalid work type', HttpStatus.BAD_REQUEST);
            }

            totalWorks = await model.countDocuments(query);
            works = await model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();

            return {
                status: 'success',
                message: 'Works fetched successfully',
                data: works,
                total: totalWorks,
                page,
                limit,
                totalPages: Math.ceil(totalWorks / limit),
            };
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // create new work for 
    async createWork(data, workName) {
        try {
            let model;
            switch (workName) {
                case 'dev':
                    model = this.DevWorkModel;
                    break;
                case 'local':
                    model = this.LocalWorkModel;
                    break;
                case 'jcb':
                    model = this.JcbWorkModel;
                    break;
                default:
                    throw new HttpException('Invalid work type', HttpStatus.BAD_REQUEST);
            }
            const work = new model(data);
            const addWork = work.save();
            if (addWork) {
                return {
                    "status": "success",
                    "message": "Work added successfully"
                }
            } else {
                return {
                    "status": "failed",
                    "message": "Something went wrong"
                }
            }
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}