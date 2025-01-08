import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { MasterService } from "../services/master.service";

@Controller("api/master")
@UseGuards(AuthGuard)
export class MasterController {
    constructor(private readonly masterService: MasterService) { }

    @Get('get-materials')
    async getMaterials(
        @Query('search') search: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        // const payload = this.jwtService.verify(token);
        // request.userId = payload.userId;
        return this.masterService.getMaterials(search, page, limit);
    }

}