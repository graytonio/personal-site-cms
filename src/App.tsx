import React from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  buildCollection,
  FirebaseCMSApp,
  NavigationBuilder,
  NavigationBuilderProps,
} from "@camberi/firecms";

import { postSchema } from "./schemas/post_schema";

import "typeface-rubik";
import "typeface-space-mono";
import { User, userSchema } from "./schemas/user_schema";

const firebaseConfig = {
  apiKey: "AIzaSyA0AR0LZIAu6NQqgnK0-aaNCCP3RsWGMks",
  authDomain: "personal-site-37121.firebaseapp.com",
  projectId: "personal-site-37121",
  storageBucket: "personal-site-37121.appspot.com",
  messagingSenderId: "936429775444",
  appId: "1:936429775444:web:6c41017d4afe63cceb5bc1",
  measurementId: "G-RKB4WHG1Y9",
};

const postCollection = buildCollection({
  path: "posts",
  schema: postSchema,
  name: "Posts",
  permissions: ({ authController }) => ({
    edit:
      authController.extra.roles.includes("post_edit") ||
      authController.extra.roles.includes("admin"),
    create:
      authController.extra.roles.includes("post_create") ||
      authController.extra.roles.includes("admin"),
    delete:
      authController.extra.roles.includes("post_delete") ||
      authController.extra.roles.includes("admin"),
  }),
});

const userCollection = buildCollection({
  path: "users",
  schema: userSchema,
  name: "Users",
  permissions: ({ authController }) => ({
    edit:
      authController.extra.roles.includes("user_edit") ||
      authController.extra.roles.includes("admin"),
    create:
      authController.extra.roles.includes("user_create") ||
      authController.extra.roles.includes("admin"),
    delete:
      authController.extra.roles.includes("user_delete") ||
      authController.extra.roles.includes("admin"),
  }),
});

export default function App() {
  const navigation: NavigationBuilder = async ({
    user,
    authController,
  }: NavigationBuilderProps) => {
    return {
      collections: [postCollection, userCollection],
    };
  };

  const myAuthenticator: Authenticator<FirebaseUser> = async ({
    user,
    authController,
    dataSource,
  }) => {
    if (user == null) return false;
    console.log("Allowing access to", user.email);

    // Is this user authorized to login
    const users = await dataSource.fetchCollection({
      schema: userSchema,
      path: "users/",
      filter: { uid: ["==", user?.uid] },
      limit: 1,
    });

    if (users.length === 0) {
      dataSource.saveEntity<User>({
        path: "users/",
        schema: userSchema,
        values: {
          email: user.email!,
          uid: user.uid,
          permissions: [],
        },
        status: "new",
      });
      return false;
    }

    const user_roles = users[0].values.permissions;

    if (!user_roles.includes("admin") && !user_roles.includes("reader")) {
      return false;
    }

    authController.setExtra({ roles: user_roles });
    return true;
  };

  return (
    <FirebaseCMSApp
      name={"GraytonWard.com"}
      authentication={myAuthenticator}
      navigation={navigation}
      firebaseConfig={firebaseConfig}
      signInOptions={["google.com", "password"]}
    />
  );
}
