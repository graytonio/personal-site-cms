import { buildSchema, buildProperty } from "@camberi/firecms";

export type Post = {
  title: string;
  slug: string;
  header_image: string;
  body: string;
  published_at: Date;
  updated_at: Date;
  tags: string[];
  featured: boolean;
};

export const postSchema = buildSchema<Post>({
  name: "Post",
  properties: {
    title: {
      dataType: "string",
      title: "Title",
      validation: { required: true },
    },
    slug: {
      dataType: "string",
      title: "Slug",
      validation: { required: true, unique: true },
    },
    header_image: buildProperty({
      dataType: "string",
      title: "Header Image",
      validation: { required: true },
      config: {
        storageMeta: {
          mediaType: "image",
          storagePath: "images",
          acceptedFiles: ["image/*"],
        },
      },
    }),
    body: {
      dataType: "string",
      title: "Post Body",
      config: {
        markdown: true,
      },
      validation: {
        required: true,
        trim: true,
      },
    },
    published_at: {
      dataType: "timestamp",
      autoValue: "on_create",
    },
    updated_at: {
      dataType: "timestamp",
      autoValue: "on_update",
    },
    tags: {
      dataType: "array",
      title: "Tags",
      of: {
        dataType: "string",
        config: {
          previewAsTag: true,
        },
      },
    },
    featured: {
      dataType: "boolean",
      title: "Featured",
      validation: {
        required: true,
      },
    },
  },
});
