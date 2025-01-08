import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { WorkService } from "../services/work.service";
import { CreateWorkDto } from "../dtos/create.dto";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/work')
@UseGuards(AuthGuard)
export class WorkController {
    constructor(private readonly workService: WorkService) { }

    @Get('/:workName')
    async getWorks(
        @Param('workName') workName: string,
        @Query('search') search: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        const validCmsPages = ['dev', 'local', 'jcb'];
        if (!validCmsPages.includes(workName)) {
            throw new BadRequestException('Invalid endpoint.');
        }
        return this.workService.getWorks(search, page, limit, workName);
    }

    @Post('/:workName/create')
    async createWork(
        @Param('workName') workName: string,
        @Body() createWorkDto: CreateWorkDto,
        @Req() req
    ) {
        const validCmsPages = ['dev', 'local', 'jcb'];
        if (!validCmsPages.includes(workName)) {
            throw new BadRequestException('Invalid endpoint.');
        }
        const data = {
            ...createWorkDto,
            userId: req.userId
        }
        return this.workService.createWork(data, workName);
    }
}
