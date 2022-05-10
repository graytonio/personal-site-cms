import { buildSchema } from "@camberi/firecms";

export type User = {
  uid: string;
  email: string;
  permissions: string[];
};

export const userSchema = buildSchema<User>({
  name: "User",
  customId: true,
  properties: {
    uid: {
      dataType: "string",
      title: "UID",
      validation: {
        unique: true,
        required: true,
      },
    },
    email: {
      dataType: "string",
      title: "Email",
      validation: {
        email: true,
        required: true,
      },
    },
    permissions: {
      dataType: "array",
      title: "Permissions",
      of: {
        dataType: "string",
        config: {
          enumValues: {
            reader: "Reader",
            admin: "Admin",
            post_create: "Post Create",
            post_edit: "Post Edit",
            post_delete: "Post Delete",
            user_create: "User Create",
            user_edit: "User Edit",
            user_delete: "User Delete",
          },
        },
      },
      validation: {
        required: true,
      },
    },
  },
});
