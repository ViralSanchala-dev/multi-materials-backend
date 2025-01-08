import { Module } from "@nestjs/common";
import { MasterController } from "./controllers/master.controlle";
import { MasterService } from "./services/master.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Material, MaterialSchema } from "./schemas/material.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Material.name,
                schema: MaterialSchema
            }
        ]),
    ],
    controllers: [MasterController],
    providers: [MasterService]
})

export class MasterModule { }