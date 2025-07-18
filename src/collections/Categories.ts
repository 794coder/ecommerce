import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "Categories",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
