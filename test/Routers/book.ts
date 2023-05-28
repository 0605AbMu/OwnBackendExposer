import { Context, HttpStatusCodes } from "../../src/Express/Core/Index";
import { Router } from "../../src/index";

let books = [{
    Name: "IT world",
    Price: 2000
}]
export const bookRouter = new Router();
bookRouter.GetAsync("/home/book", async (context) => {
    context.response.Json(books, HttpStatusCodes.OK)
})

bookRouter.PostAsync("/home/book", async (context) => {
    let book = await context.request.BodyAsJsonContentWithT<{Name: string, Price: number}>();
    books.push(book);
    context.response.SendSuccess("new book added!");
})

