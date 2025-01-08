import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DevWork, DevWorkSchema } from "./schemas/devwork.schema";
import { LocalWork, LocalWorkSchema } from "./schemas/localwork.schema";
import { JcbWork, JcbWorkSchema } from "./schemas/jobwork.schema";
import { WorkController } from "./controller/work.controller";
import { WorkService } from "./services/work.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DevWork.name, schema: DevWorkSchema },
            { name: LocalWork.name, schema: LocalWorkSchema },
            { name: JcbWork.name, schema: JcbWorkSchema },
        ]),
    ],
    controllers: [WorkController],
    providers: [WorkService]
})

export class WorkModule { }