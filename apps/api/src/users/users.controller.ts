import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";

interface CreateUserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateUserPayload extends Partial<CreateUserPayload> {
  isActive?: boolean;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateUserPayload) {
    return this.usersService.create(body);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() body: UpdateUserPayload,
  ): Promise<any> {
    return this.usersService.update(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}
