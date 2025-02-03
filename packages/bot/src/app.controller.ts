import { Controller, Get, NotFoundException } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "Hello World!";
  }

  @Get("favicon.ico")
  getFavicon(): string {
    throw new NotFoundException();
  }
}
