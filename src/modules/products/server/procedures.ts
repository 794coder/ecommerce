import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.category) {
        const categoryData = await ctx.payload.find({
          collection: "Categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedData = categoryData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));
        const subCategories = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
          subCategories.push(
            ...parentCategory.subcategories.map((sub) => sub.slug)
          );
        }
        where["category.slug"] = {
          in: [parentCategory.slug, ...subCategories],
        };
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, //populate category & image
        where,
      });
      return data;
    }),
});
