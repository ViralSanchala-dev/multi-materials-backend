import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Material } from "../schemas/material.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MasterService {

    constructor(
        @InjectModel(Material.name) private MaterialModel: Model<Material>,
    ) { }

    async getMaterials(search: string, page: number, limit: number) {
        try {
            const query: any = {};

            if (search) {
                query.$or = [
                    {
                        name: { $regex: search, $options: 'i' }
                    },
                    {
                        describe: { $regex: search, $options: 'i' }
                    }
                ]
            }

            const skip = (page - 1) * limit;
            const totalCards = await this.MaterialModel.countDocuments(query);

            const cards = await this.MaterialModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalPages = Math.ceil(totalCards / limit);

            return {
                status: "success",
                message: "Cards fetched successfully",
                data: cards,
                total: totalCards,
                page,
                limit,
                totalPages
            };
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}