import { buildSchema, buildProperty } from "@camberi/firecms";

export type Post = {
  title: string;
  header_image: string;
  body: string;
  published_at: Date;
  updated_at: Date;
  tags: string[];
};

export const postSchema = buildSchema<Post>({
  name: "Post",
  properties: {
    title: {
      dataType: "string",
      title: "Title",
      validation: { required: true },
    },
    header_image: buildProperty({
      dataType: "string",
      title: "Header Image",
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
  },
});
