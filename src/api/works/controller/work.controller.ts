import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { WorkService } from "../services/work.service";
import { DevWorkDto, JcbWorkDto, LocalWorkDto } from "../dtos/create.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { validateOrReject, ValidationError } from "class-validator";
import { log } from "node:console";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "node:path";
import { plainToInstance } from "class-transformer";

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
    // @UseInterceptors(
    //     FilesInterceptor('files', 10, {
    //         storage: diskStorage({
    //             destination: './uploads/work-images',
    //             filename: (req, file, cb) => {
    //                 const randomString = Math.random().toString(36).substring(2, 8);
    //                 const extension = extname(file.originalname);
    //                 const uniqueName = `${randomString}${extension}`;
    //                 cb(null, uniqueName);
    //             },
    //         }),
    //         limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    //         fileFilter: (req, file, cb) => {
    //             if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi)$/)) {
    //                 return cb(new BadRequestException('Unsupported file type'), false);
    //             }
    //             cb(null, true);
    //         },
    //     }),
    // )
    // async createWork(
    //     @Param('workName') workName: string,
    //     @Body() createWorkDto: any,
    //     @Req() req,
    //     @UploadedFiles() files: Express.Multer.File[],
    // ) {
    //     const validCmsPages = ['dev', 'local', 'jcb'];
    //     if (!validCmsPages.includes(workName)) {
    //         throw new BadRequestException('Invalid endpoint.');
    //     }

    //     const validationSchemas = {
    //         dev: DevWorkDto,
    //         local: LocalWorkDto,
    //         jcb: JcbWorkDto,
    //     };

    //     const ValidationClass = validationSchemas[workName];
    //     if (!ValidationClass) {
    //         throw new BadRequestException(`No validation schema found for ${workName}`);
    //     }

    //     const validatedData = new ValidationClass();
    //     Object.assign(validatedData, createWorkDto);

    //     try {
    //         await validateOrReject(validatedData);
    //     } catch (errors) {
    //         console.log("ewfw", errors);

    //         throw new BadRequestException(this.formatFirstValidationError(errors));
    //     }

    //     const uploadedFilePaths = files?.length
    //         ? files.map((file) => file.path)
    //         : [];

    //     const data = {
    //         ...validatedData,
    //         userId: req.userId,
    //         files: uploadedFilePaths
    //     };
    //     return this.workService.createWork(data, workName);
    // }

    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './uploads/work-images',
                filename: (req, file, cb) => {
                    const randomString = Math.random().toString(36).substring(2, 8);
                    const extension = extname(file.originalname);
                    const uniqueName = `${randomString}${extension}`;
                    cb(null, uniqueName);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi)$/)) {
                    return cb(new BadRequestException('Unsupported file type'), false);
                }
                cb(null, true);
            },
        }),
    )
    async createWork(
        @Param('workName') workName: string,
        @Body() createWorkDto: any,
        @Req() req,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const validCmsPages = ['dev', 'local', 'jcb'];
        if (!validCmsPages.includes(workName)) {
            throw new BadRequestException('Invalid endpoint.');
        }

        // Select the appropriate DTO class based on workName
        const validationSchemas = {
            dev: DevWorkDto,
            local: LocalWorkDto,
            jcb: JcbWorkDto,
        };
        const ValidationClass = validationSchemas[workName];
        if (!ValidationClass) {
            throw new BadRequestException(`No validation schema found for ${workName}`);
        }

        // Transform and validate DTO
        const validatedData = plainToInstance(ValidationClass, createWorkDto);

        try {
            await validateOrReject(validatedData);
        } catch (errors) {
            throw new BadRequestException(this.formatFirstValidationError(errors));
        }

        // Map uploaded files to paths
        const uploadedFilePaths = files?.length
            ? files.map((file) => file.path)
            : [];

        const data = {
            ...validatedData,
            userId: req.userId, // Assume userId is available in req object
            files: uploadedFilePaths,
        };

        return this.workService.createWork(data, workName);
    }

    private formatFirstValidationError(errors: ValidationError[]): string {
        const firstError = errors[0];
        const constraints = Object.values(firstError.constraints || {});
        return `${constraints[0]}`;
    }
}
